import express from 'express';
import { notificationController } from '../controllers/index.js';

const router = express.Router();

router.get(
    "/",
    notificationController.getNotifications
)

router.get(
    "/unread",
    notificationController.getUnreadCount
)

router.put(
    "/read-notification/:notificationId",
    notificationController.readNotification
)

export default router;