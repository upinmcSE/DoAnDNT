import apiClient from "./apiClient";

const getNotifications = async () => {
    try {
        const response = await apiClient.get('/notification');
        return response;
    } catch (error) {
        throw error;
    }
}

const readNotification = async (notificationId) => {
    try {
        const response = await apiClient.put(`/notification/read-notification/${notificationId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

const unreadNotification = async () => {
    try {
        const response = await apiClient.get(`/notification/unread`);
        return response;
    } catch (error) {
        throw error;
    }
}

export {
    getNotifications,
    readNotification,
    unreadNotification
}