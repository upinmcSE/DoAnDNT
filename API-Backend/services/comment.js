import { Comment, Post, User, Notification } from '../models/index.js';
import mongoose from 'mongoose';
import HttpStatusCode from '../error/HttpStatusCode.js';
import Exception from '../error/Exception.js';
import socket from '../config/socket/socket.js';

const { emitNotification } = socket;

const getCommentsByPostId = async (postId) => {
    try {
      const comments = await Comment.find({ postId })
          .select('content user._id user.name user.avtUrl createdAt replies') // Lấy thông tin cần thiết
          .lean(); // Giúp giảm tải việc chuyển đổi dữ liệu từ mongoose document
      return comments
    } catch (error) {
      throw new Error(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
};

const createComment = async (postId, userId, content) => {
    try {

        // Kiểm tra bài viết có tồn tại không
        const post = await Post.findById(postId);
        if (!post) {
          throw new Exception(HttpStatusCode.NOT_FOUND, "Post not found");
        }

        const user = await User.findById(userId);
        if (!user) {
          throw new Exception(HttpStatusCode.NOT_FOUND, "User not found");
        }
    
        // Tạo comment mới
        const newComment = await Comment.create({
          content,
          user: {
            _id: user._id,
            name: user.name,
            avtUrl: user.avtUrl,
          },
          postId,
        });
    
        // Thêm comment vào bài viết
        post.comments.push(newComment._id);
        await post.save();

        // Tạo thông báo cho chủ bài viết
        const postOwnerId = post.userId.toString(); // Lấy ID của chủ bài viết
        userId = userId.toString(); // Đảm bảo userId là chuỗi

        if (postOwnerId !== userId) { // Chỉ gửi nếu người comment không phải chủ bài viết
          const notification = new Notification({
            type: 'comment_notice',
            content: `${user.name} đã bình luận bài viết của bạn: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
            fromUser: userId,
            toUser: postOwnerId,
            postId,
          });
          await notification.save();

          // Gửi thông báo realtime đến chủ bài viết nếu họ online
          emitNotification(postOwnerId, {
            _id: notification._id.toString(),
            type: notification.type,
            content: notification.content,
            fromUser: user.name,
            toUser: postOwnerId,
            postId: notification.postId.toString(),
            createdAt: notification.createdAt,
          });
        }
    
        // Populate thông tin user và tính số lượng likes
        const populatedComment = await Comment.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(newComment._id) } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
              pipeline: [
                { $project: { _id: 1, name: 1, avtUrl: 1 } },
              ],
            },
          },
          { $unwind: "$user" },
        ]);
    
        return populatedComment[0]; // Trả về comment đã populate
      } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
      }
}


const updateComment = async (commentId, userId, content) => {
  try{
    // Kiểm tra comment có tồn tại không
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Comment not found");
    }

    // Kiểm tra người dùng có quyền cập nhật comment không
    if (comment.user._id.toString() !== userId) {
      throw new Exception(HttpStatusCode.FORBIDDEN, "You do not have permission to update this comment");
    }

    // Cập nhật nội dung comment
    comment.content = content.trim();
    await comment.save();

    return {
      _id: comment._id,
      content: comment.content,
      user: {
        _id: comment.user._id,
        name: comment.user.name,
        avtUrl: comment.user.avtUrl || "",
      },
    };
  }catch (error) {
    throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }

}

const deleteComment = async (commentId, userId) => {
  try{
    // Kiểm tra comment có tồn tại không
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Comment not found");
    }

    // Kiểm tra người dùng có quyền xóa comment không
    if (comment.user._id.toString() !== userId) {
      throw new Exception(HttpStatusCode.FORBIDDEN, "You do not have permission to delete this comment");
    }

    // Xóa comment
    await Comment.findByIdAndDelete(commentId);

    // Cập nhật bài viết để xóa comment khỏi danh sách
    await Post.updateOne(
      { _id: comment.postId },
      { $pull: { comments: commentId } }
    );

    return;
  }catch (error) {
    throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }
}

const getRepliesByCommentId = async (commentId) => {
  try{
    // Tìm comment theo ID
    const comment = await Comment.findById(commentId)
      .select('replies') // Chỉ lấy trường replies
      .lean(); // Sử dụng lean để trả về object thuần, không phải mongoose document
    if (!comment) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Comment not found");
    }

    return comment.replies.map(reply => ({
      _id: reply._id,
      content: reply.content,
      user: {
        _id: reply.user._id,
        name: reply.user.name,
        avtUrl: reply.user.avtUrl
      },
    }));

  }catch (error) {
    throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }
}

const createReply = async (commentId, userId, content) => {
  try{
    const user = await User.findById(userId);
    if (!user) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "User not found");
    }

    // Thêm reply vào comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          replies: {
            content: content.trim(),
            user: {
              _id: user._id,
              name: user.name,
              avtUrl: user.avtUrl || "", // avtUrl là tùy chọn
            },
          },
        },
      },
      { new: true } // Trả về document đã cập nhật
    );

    if (!updatedComment) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Comment not found");
    }

    // tạo thông báo cho chủ comment
    const commentOwnerId = updatedComment.user._id.toString(); 
    userId = userId.toString();

    if (commentOwnerId !== userId) { // Chỉ gửi nếu người reply không phải chủ comment
      const notification = new Notification({
        type: 'reply_notice',
        content: `${user.name} đã trả lời bình luận của bạn: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
        fromUser: userId,
        toUser: commentOwnerId,
        postId: updatedComment.postId,
      });
      await notification.save();

      // Gửi thông báo realtime đến chủ comment nếu họ online
      emitNotification(commentOwnerId, {
        _id: notification._id.toString(),
        type: notification.type,
        content: notification.content,
        fromUser: user.name,
        toUser: commentOwnerId,
        postId: updatedComment.postId.toString(),
        createdAt: notification.createdAt,
      });
    }

    return {
      _id: updatedComment._id,
      content: content.trim(),
      user: {
        _id: user._id,
        name: user.name,
        avtUrl: user.avtUrl
      },
      replies: updatedComment.replies,
    }

  }catch (error) {
    throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }
}

const updateReply = async (commentId, replyId, userId, content) => {
  try{
    // Tìm comment chứa reply
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Comment not found");
    }

    // Tìm reply trong comment
    const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
    if (replyIndex === -1) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Reply not found");
    }

    // Kiểm tra người dùng có quyền cập nhật reply không
    if (comment.replies[replyIndex].user._id.toString() !== userId) {
      throw new Exception(HttpStatusCode.FORBIDDEN, "You do not have permission to update this reply");
    }

    // Cập nhật nội dung reply
    comment.replies[replyIndex].content = content.trim();
    await comment.save();

    return {
      _id: replyId,
      content: content.trim(),
      user: {
        _id: comment.replies[replyIndex].user._id,
        name: comment.replies[replyIndex].user.name,
        avtUrl: comment.replies[replyIndex].user.avtUrl || "",
      },
    };

  }catch (error) {
    throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }
}

const deleteReply = async (commentId, replyId, userId) => {
  try{
    console.log("Deleting reply:", replyId, "from comment:", commentId, "by user:", userId);
    // Tìm comment chứa reply
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Comment not found");
    }

    // Tìm reply trong comment
    const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
    if (replyIndex === -1) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Reply not found");
    }

    // Kiểm tra người dùng có quyền xóa reply không
    if (comment.replies[replyIndex].user._id.toString() !== userId) {
      throw new Exception(HttpStatusCode.FORBIDDEN, "You do not have permission to delete this reply");
    }

    // Xóa reply khỏi comment
    comment.replies.splice(replyIndex, 1);
    await comment.save();

    return;

  }catch (error) {
    throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }
}


export default {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment,
    getRepliesByCommentId,
    createReply,
    updateReply,
    deleteReply
}