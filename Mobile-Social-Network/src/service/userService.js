import apiClient from "./apiClient";

const updateProfile = async (data) => {
    try {
        const response = await apiClient.put("/user", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}

const getUser = async (userId) => {
    try {
        const response = await apiClient.get(`/user/userId/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

const followUser = async (userId) => {
    try {
        const response = await apiClient.post(`/user/follow/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

const unfollowUser = async (userId) => {
    try {
        const response = await apiClient.post(`/user/unfollow/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
}


export {
    updateProfile,
    getUser,
    followUser,
    unfollowUser,
}