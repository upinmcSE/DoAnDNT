import apiClient from "./apiClient";


const createPost = async (post) => {
    try {
        const response = await apiClient.post("/post", post, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    }catch (error) {
        throw error;
    }
}

const getPosts = async () => {
    try {
        const response = await apiClient.get("/post");
        return response;
    }catch (error) {
        throw error;
    }
}

const getPostsNetwork = async () => {
    try {
        const response = await apiClient.get("/post/network");
        return response;
    }catch (error) {
        throw error;
    }
}

const getPostsByUserId = async (userId) => {
    try {
        const response = await apiClient.get(`/post/postId/${userId}`);
        return response;
    }catch (error) {
        throw error;
    }
}

const getPostByPostId = async (postId) => {
    try {
        const response = await apiClient.get(`/post/get-post/${postId}`);
        return response;
    }catch (error) {
        throw error;
    }
}

const likePost = async (postId) => {
    try {
        const response = await apiClient.post('/post/like', { postId });
        return response;
    }catch (error) {
        throw error;
    }
}

const unlikePost = async (postId) => {
    try {
        const response = await apiClient.post('/post/unlike', { postId });
        return response;
    }catch (error) {
        throw error;
    }
}

const getLikes = async (postId) => {
    try {
        const response = await apiClient.get(`/post/like/${postId}`);
        return response;
    }catch (error) {
        throw error;
    }
}

const deletePost = async (postId) => {
    try {
        const response = await apiClient.delete(`/post/${postId}`);
        return response;
    }catch (error) {
        throw error;
    }
}

export {
    createPost,
    getPosts,
    getPostsNetwork,
    getPostByPostId,
    likePost,
    unlikePost,
    getLikes,
    getPostsByUserId,
    deletePost
}