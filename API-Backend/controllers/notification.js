import HttpStatusCode from "../error/HttpStatusCode.js";
import { sendSuccess, sendError } from '../middlewares/responseHandler.js';
import { notificationService } from "../services/index.js";


const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await notificationService.getNotifications(userId);
        return sendSuccess(res, notifications, 'Lấy thông báo thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const getUnreadCount = async (req, res) => {
    try {
        const userId = req.userId;
        const count = await notificationService.getUnreadCount(userId);
        return sendSuccess(res, count, 'Lấy số lượng thông báo chưa đọc thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

const readNotification = async (req, res) => {
    try {
        const userId = req.userId;
        const notificationId = req.params.notificationId;
        await notificationService.readNotification(userId, notificationId);
        return sendSuccess(res, null, 'Đánh dấu thông báo đã đọc thành công', HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code || HttpStatusCode.INTERNAL_SERVER);
    }
}

export default {
    getNotifications,
    getUnreadCount,
    readNotification
}
