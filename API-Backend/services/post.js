import { Post, User, Notification } from '../models/index.js';
import HttpStatusCode from '../error/HttpStatusCode.js';
import Exception from '../error/Exception.js';
import socket from '../config/socket/socket.js';

const { emitNotification } = socket;

const createPost = async ({ userId, content, imageUrls }) => {
    try {
      const newPost = await Post.create({
        userId,
        content,
        imageUrls: imageUrls || [],
      });
      
      const user = await User.findById(userId).populate('followers');
      if (!user) {
        throw new Exception(HttpStatusCode.NOT_FOUND, 'User not found');
      }
      const followers = user.followers;

      
      const notificationPromises = followers.map(async (follower) => {
        const notification = new Notification({
          type: 'post_notice',
          content: `${user.name} đã đăng một bài viết mới hãy xem ngay`,
          fromUser: userId,
          toUser: follower._id,
          postId: newPost._id,
        });
        await notification.save();
  
        emitNotification(follower._id.toString(), {
          _id: notification._id.toString(),
          type: notification.type,
          content: notification.content,
          fromUser: user.name,
          postId: newPost._id.toString(),
          createdAt: notification.createdAt,
        });

        return notification;
      });

      await Promise.all(notificationPromises);

      return newPost;

    } catch (error) {
      throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
};

const getAllPosts = async () => {
    try {
        const posts = await Post.find()
            .populate('userId', 'name avtUrl')
            .populate('comments', 'content userId')
            .sort({ createdAt: -1 });
        return posts;
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
}


const getAllPostsNetwork = async (userId) => {
  try {
      // Lấy thông tin người dùng và danh sách following
      const user = await User.findById(userId).select('following');
      if (!user) {
          throw new Exception(HttpStatusCode.NOT_FOUND, 'Người dùng không tồn tại');
      }

      // Lấy tất cả bài viết của những người trong danh sách following
      const posts = await Post.find({ userId: { $in: user.following } })
          .populate('userId', 'name avtUrl') // Populate thông tin người dùng
          .populate('comments', 'content userId') // Populate thông tin bình luận
          .sort({ createdAt: -1 }); // Sắp xếp bài viết theo thời gian (mới nhất trước)

      return posts;
  } catch (error) {
      throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message || 'Đã có lỗi xảy ra');
  }
};

const getPostsByUserId = async (userId) => {
    try {
        const posts = await Post.find({ userId })
            .populate('userId', 'name avtUrl')
            .populate('comments', 'content userId')
            .sort({ createdAt: -1 });
        return posts;
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
}

const likePost = async (postId, userId) => {
  try {
    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Post not found");
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "User not found");
    }

    // Check if already liked
    if (post.likes.includes(userId)) {
      throw new Exception(HttpStatusCode.BAD_REQUEST, "Post already liked");
    }

    // Add like
    post.likes.push(userId);
    
    // Send notification if not liking own post
    const postOwnerId = post.userId;
    if (postOwnerId.toString() !== userId.toString()) {
      const notification = new Notification({
        type: 'like_notice',
        content: `${user.name} đã thích bài viết của bạn`,
        fromUser: userId,
        toUser: postOwnerId,
        postId,
      });
      await notification.save();

      // Send realtime notification
      emitNotification(postOwnerId.toString(), {
        _id: notification._id.toString(),
        type: notification.type,
        content: notification.content,
        fromUser: user.name,
        postId: notification.postId.toString(),
        timestamp: notification.createdAt,
      });
    }

    await post.save();

    return {
      likes: post.likes.length,
    };
  } catch (error) {
    throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }
};

const unlikePost = async (postId, userId) => {
  try {
    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Post not found");
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "User not found");
    }

    // Check if not liked
    if (!post.likes.includes(userId)) {
      throw new Exception(HttpStatusCode.BAD_REQUEST, "Post not liked");
    }

    // Remove like
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    
    await post.save();

    return {
      likes: post.likes.length,
    };
  } catch (error) {
    throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }
};

const listLikesPost = async (postId) => {
  try {
    // Tìm post theo ID và populate mảng likes với các trường từ User
    const post = await Post.findById(postId).populate('likes', '_id name avtUrl');

    if (!post) {
      throw new Exception(HttpStatusCode.NOT_FOUND, "Post not found");
    }

    // Kiểm tra xem mảng likes có dữ liệu không
    if (!post.likes || post.likes.length === 0) {
      return {
        success: true,
        message: "Không có người nào thích bài viết này",
        data: []
      };
    }

    const likesData = post.likes.map(like => ({
      id: like._id.toString(),
      name: like.name || 'Người dùng không tên', 
      avtUrl: like.avtUrl || ''
    }));

    return likesData
    
  } catch (error) {
    throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }
};

const deletePost = async (postId, userId) => {
  try{
      const post = await Post.findById(postId);
      if (!post) {
          throw new Exception(HttpStatusCode.NOT_FOUND, "Post not found");
      }

      // Kiểm tra xem người dùng có quyền xóa bài viết này không
      if (post.userId.toString() !== userId) {
          throw new Exception(HttpStatusCode.FORBIDDEN, "You do not have permission to delete this post");
      }

      await Post.deleteOne({ _id: postId });
      return { message: "Post deleted successfully" };
  }catch (error) {
      throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
  }
}

const getPostByPostId = async (postId) => {
    try {
        const post = await Post.findById(postId)
            .populate('userId', 'name avtUrl')
            .sort({ createdAt: -1 });

        if (!post) {
            throw new Exception(HttpStatusCode.NOT_FOUND, 'Post not found');
        }
        return post;
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }

}

export default {
    createPost,
    getPostsByUserId,
    likePost,
    unlikePost,
    getAllPosts,
    listLikesPost,
    deletePost,
    getAllPostsNetwork,
    getPostByPostId
}