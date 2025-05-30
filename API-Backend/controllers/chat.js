import HttpStatusCode from "../error/HttpStatusCode.js";
import { sendSuccess, sendError } from '../middlewares/responseHandler.js';
import { chatService } from "../services/index.js";
import { cloudinary } from "../config/cloudinary/cloudinary.js";

// tạo phòng chat
const createConversation = async (req, res) => {
    try{
        const userA = req.userId;
        const userB = req.params.userB;

        const result = await chatService.createConversation(userA, userB);
        return sendSuccess(res, result, "Tạo phòng chat thành công", HttpStatusCode.OK);
    }catch(error){
        return sendError(res, error.message, error.code);
    }
  
}

// gửi tin nhắn
const sendMessage = async (req, res) => {
    try{
        const {userB} = req.params;
        const userA = req.userId;
        const { text } = req.body;
        const files = req.files;

        // Upload ảnh lên Cloudinary
        const uploadedImages = [];
        if (files && files.length > 0) {
        const uploadPromises = files.map((file) =>
            cloudinary.uploader.upload(file.path, {
            folder: "messages",
            })
        );
        const results = await Promise.all(uploadPromises);
        uploadedImages.push(...results.map((result) => ({
            url: result.secure_url,
            public_id: result.public_id,
        })));
        }

        const result = await chatService.sendMessage({
            userA, 
            userB, 
            text, 
            imageUrls: uploadedImages.map((img) => img.url)
        });

        return sendSuccess(res, result, "Gửi tin nhắn thành công", HttpStatusCode.OK);
    }catch(error){
        return sendError(res, error.message, error.code);
    }
}

// lấy tin nhắn
const getMessages = async (req, res) => {
    try{
        const conversationId = req.params.conversationId;
        const result = await chatService.getMessages(conversationId);
        return sendSuccess(res, result, "Lấy tin nhắn thành công", HttpStatusCode.OK);
    }catch(error){
        return sendError(res, error.message, error.code);
    }
}

// lấy danh sách phòng chat
const getConversations = async (req, res) => {
    try{
        const userId = req.userId;
        const result = await chatService.getConversations(userId);
        return sendSuccess(res, result, "Lấy danh sách phòng chat thành công", HttpStatusCode.OK);
    }catch(error){
        return sendError(res, error.message, error.code);
    }
}

const readMessage = async (req, res) => {
    try{
        const messageId = req.params.messageId;
        const userId = req.userId;
        const result = await chatService.readMessage(messageId, userId);
        return sendSuccess(res, result, "Đánh dấu tin nhắn đã đọc thành công", HttpStatusCode.OK);
    }catch(error){
        return sendError(res, error.message, error.code);
    }
}

const getUnreadMessagesCount = async (req, res) => {
    try {
        console.log('getUnreadMessagesCount');
        const userId = req.userId;
        const result = await chatService.getUnreadMessagesCount(userId);
        return sendSuccess(res, result , "Lấy số lượng tin nhắn chưa đọc thành công", HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
}

const blockMassage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.userId;

        const result = await chatService.blockMassage(userId, messageId);
        return sendSuccess(res, result, "Thu hồi tin nhắn thành công", HttpStatusCode.OK);
    } catch (error) {
        return sendError(res, error.message, error.code);
    }
}

export default {
    createConversation,
    sendMessage,
    getMessages,
    getConversations,
    readMessage,
    getUnreadMessagesCount,
    blockMassage
}