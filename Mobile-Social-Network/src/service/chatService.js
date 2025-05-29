import apiClient from "./apiClient";

const createConversation = async (userId) => {
    try {
        const response = await apiClient.post(`/chat/conversation/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const sendMessage = async (userId, formData) => {
    try {
        console.log('sendMessage',formData)
        const response = await apiClient.post(`/chat/message/${userId}`, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;   
    } catch (error) {
        throw error;
    }
}

const getMessages = async (conversationId) => {
    try {
        const response = await apiClient.get(`/chat/message/${conversationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getConversations = async () => {
    try {
        const response = await apiClient.get(`/chat/conversation`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const readMessage = async (messageId) => {
    try {
        const response = await apiClient.put(`/chat/message/read/${messageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getUnreadMessagesCount = async () => {
    try {
        const response = await apiClient.get(`/chat/unread-count`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const blockMassage = async (messageId) => {
    try {
        const response = await apiClient.delete(`/chat/message/${messageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {
    createConversation,
    sendMessage,    
    getMessages,
    getConversations,
    readMessage,
    blockMassage,
    getUnreadMessagesCount
}