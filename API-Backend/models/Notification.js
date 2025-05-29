import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['post_notice', 'comment_notice', 'follow_notice', 'like_notice', 'reply_notice'], // Các loại thông báo
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến collection User
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Người nhận thông báo
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Tham chiếu đến bài viết (nếu có)
    default: null,
  },
  read: {
    type: Boolean,
    default: false, // Trạng thái đã đọc hay chưa
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}
);

export default mongoose.model('Notification', notificationSchema);