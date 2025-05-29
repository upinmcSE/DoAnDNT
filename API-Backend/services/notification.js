import HttpStatusCode from '../error/HttpStatusCode.js';
import Exception from '../error/Exception.js';
import { Notification } from '../models/index.js';


const getNotifications = async (userId) => {
    try {
      
      const notifications = await Notification.find({ toUser: userId })
        .populate('fromUser', 'name') // Lấy tên người gửi
        .sort({ createdAt: -1 }); // Sắp xếp theo thời gian giảm dần
      return notifications;
    } catch (error) {
      throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
};

const getUnreadCount = async (userId) => {
    try {
        const count = await Notification.countDocuments({ toUser: userId, read: false });
        return count;
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
};

const readNotification = async (userId, notificationId) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, toUser: userId },
            { read: true },
            { new: true }
        );
        if (!notification) {
            throw new Exception(HttpStatusCode.NOT_FOUND, 'Thông báo không tồn tại hoặc đã được đánh dấu là đã đọc');
        }
        return notification;
    } catch (error) {
        throw new Exception(HttpStatusCode.INTERNAL_SERVER, error.message);
    }
}

export default {
    getNotifications,
    getUnreadCount,
    readNotification
}