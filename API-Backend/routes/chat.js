import express from 'express';
import { chatController } from '../controllers/index.js';
import { upload } from '../config/cloudinary/cloudinary.js';
import { body } from 'express-validator';

const router = express.Router();

// Lấy hoặc tạo phòng chat
router.post("/conversation/:userB", chatController.createConversation);


// Gửi tin nhắn
router.post(
    "/message/:userB",
    upload.array("images", 10),
    body('content'),
    chatController.sendMessage
);


// Lấy tin nhắn
router.get(
    "/message/:conversationId",
    chatController.getMessages
);

// láy danh sách phòng chat của người dùng
router.get(
    "/conversation", 
    chatController.getConversations
);


router.put(
    "/message/read/:messageId",
    chatController.readMessage
);

router.delete(
    "/message/:messageId",
    chatController.blockMassage
);

// Lấy số lượng tin nhắn chưa đọc
router.get(
    "/unread-count",
    chatController.getUnreadMessagesCount
);



export default router;