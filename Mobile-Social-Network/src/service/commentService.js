import apiClient from "./apiClient";

const createComment = async (postId, content) => {
    try {
        const response = await apiClient.post(`/comment/${postId}`, { content });
        return response;
    } catch (error) {
        throw error;
    }
}

const createReply = async (commentId, content) => {
    try {
        const response = await apiClient.put(`/comment/reply/`, 
            { 
                content,
                commentId 
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

const getComments = async (postId) => {
    try {
        const response = await apiClient.get(`/comment/${postId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

const getRepliesByCommentId = async (commentId) => {
    try {
        const response = await apiClient.get(`/comment/reply/${commentId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

const deleteComment = async (commentId) => {
    try {
        const response = await apiClient.delete(`/comment/${commentId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

const deleteReply = async (replyId, commentId) => {
    try {
        console.log("hihi", replyId, commentId);
        const response = await apiClient.delete(`/comment/reply/${replyId}`,
            {
                data: { commentId }
            }
        );
        return response;
    } catch (error) {
        console.log("Error deleting reply:", error);
        throw error;
    }
}

export {
    createComment,
    createReply,
    getComments,
    getRepliesByCommentId,
    deleteComment,
    deleteReply
}