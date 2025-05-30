import Exception from '../error/Exception.js';
import HttpStatusCode from '../error/HttpStatusCode.js';
import { Communication, Message }from '../models/index.js';
import socket from '../config/socket/socket.js';
import mongoose from 'mongoose';

const { emitMessage } = socket;

const createConversation = async (userA, userB) => {
    try {
        // Check if the conversation already exists

        const existingConversation = await Communication.findOne({
            participants: { $all: [userA, userB] },
        });

        if (!existingConversation) {
            const conversation = await Communication.create({
                participants: [userA, userB],
            });
            return conversation;
        }
        
        return existingConversation;

    } catch (error) {
        throw new Exception('Failed to create conversation', HttpStatusCode.INTERNAL_SERVER);
    }
}

export const sendMessage = async ({ userA, userB, text, imageUrls}) => {

    try {
        // tìm phòng chat giữa userA và userB
        const conversation = await Communication.findOne({
            participants: { $all: [userA, userB] },
        });

        if (!conversation) {
            throw new Exception('Phòng chat không tồn tại', HttpStatusCode.NOT_FOUND);
        }

        const message = await Message.create({
            conversationId: conversation._id,
            senderId: userA,
            receiverId: userB,
            text,
            imageUrl: imageUrls,
        });

        const data = {
            _id: message._id.toString(),
            conversationId: conversation._id.toString(),
            senderId: userA.toString(),
            receiverId: userB.toString(),
            text,
            imageUrl: imageUrls,
        }

        
        emitMessage(userB, data);

        return message;
    } catch (error) {
        throw new Exception('Failed to send message', HttpStatusCode.INTERNAL_SERVER);
    }
       
}

const getMessages = async (conversationId) => {
    try {
        const conversation = await Communication.findById(conversationId)
            .populate({
                path: 'participants',
                select: 'name avtUrl',
            })
               
        if (!conversation) {
            throw new Exception('Phòng chat không tồn tại', HttpStatusCode.NOT_FOUND);
        }

        const messages = await Message.find({ conversationId })
            .select('-__v');

        return { conversation, messages };
    } catch (error) {
        throw new Exception('Failed to get messages', HttpStatusCode.INTERNAL_SERVER);
    }
};

// Lấy danh sách các phòng chat của người dùng
const getConversations = async (userId) => {
    try {
        // Lấy tất cả conversations chứa userId
        const communications = await Communication.find({
            participants: userId,
        })
            .populate({
                path: 'participants',
                select: 'name avtUrl',
            })
            .select('-__v');

        // Map qua các conversation để thêm lastMessage
        const filteredCommunications = await Promise.all(
            communications.map(async (communication) => {
                // Tìm tin nhắn gần nhất cho conversation này
                const lastMessage = await Message.findOne({
                    conversationId: communication._id,
                })
                    .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần
                    .select('text senderId createdAt isRead imageUrl'); // Lấy các trường cần thiết

                // Loại bỏ thông tin của chính userId khỏi participants
                const filteredParticipants = communication.participants.filter(
                    (participant) => participant._id.toString() !== userId
                );

                // Tạo object lastMessage (nếu có)
                const lastMessageData = lastMessage
                    ? {
                          text: lastMessage.isRecalled ? "Tin nhắn đã thu hồi" : lastMessage.text,
                          senderId: lastMessage.senderId,
                          createdAt: lastMessage.createdAt,
                          imageUrl: lastMessage.imageUrl || null,
                          isRead: lastMessage.isRead,
                      }
                    : null;

                return {
                    ...communication.toObject(),
                    participants: filteredParticipants,
                    lastMessage: lastMessageData,
                };
            })
        );

        return filteredCommunications;
    } catch (error) {
        throw new Exception('Failed to get conversations', HttpStatusCode.INTERNAL_SERVER);
    }
};

const readMessage = async (messageId, userId) => {
    try{
        console.log('messageId',messageId)
        const message = await Message.findOneAndUpdate(
            { _id: messageId, receiverId: userId },
            { isRead: true },
            { new: true }
        );
        if (!message) {
            throw new Exception('Message not found or already read', HttpStatusCode.NOT_FOUND);
        }
        return message;
    }catch(error){
        throw new Exception('Failed to read message', HttpStatusCode.INTERNAL_SERVER);
    }
}

const getUnreadMessagesCount = async (userId) => {
    try {
        console.log('getUnreadMessagesCount', userId);
        const result = await Message.aggregate([
            // Lọc tin nhắn chưa đọc mà userId là receiverId
            {
                $match: {
                    receiverId: new mongoose.Types.ObjectId(userId),
                    isRead: false,
                },
            },
            // Sắp xếp theo createdAt giảm dần để tin mới nhất lên đầu
            {
                $sort: {
                    createdAt: -1,
                },
            },
            // Nhóm theo conversationId, chỉ lấy tin nhắn đầu tiên (mới nhất)
            {
                $group: {
                    _id: "$conversationId",
                },
            },
            // Đếm số lượng nhóm (cuộc hội thoại)
            {
                $count: "count",
            },
        ]);

        const count = result.length > 0 ? result[0].count : 0;

        return  {count} ;
    } catch (error) {
        throw new Exception('Failed to get unread messages count', HttpStatusCode.INTERNAL_SERVER);
    }
};

const blockMassage = async (userId, messageId) => {
    try {

        const message = await Message.findByIdAndUpdate(
            messageId,
            { text : 'Tin nhẵn đã thu hồi' },
            { new: true }
        )
        if (!message) {
            throw new Exception('Message not found', HttpStatusCode.NOT_FOUND);
        }
        return message;
    }catch(error) {
        throw new Exception('Failed to update comment', HttpStatusCode.INTERNAL_SERVER);
    }
}




export default {
    createConversation,
    sendMessage,
    getMessages,
    getConversations,
    readMessage,
    getUnreadMessagesCount,
    blockMassage,
}