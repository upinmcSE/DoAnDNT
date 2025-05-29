import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: "http://192.168.1.6:3002/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 1000 * 60 * 5 
})


// Request interceptor: Can thiệp vào request trước khi nó được gửi đi
apiClient.interceptors.request.use(async (config) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});




let logoutFunction = null;
export const setLogoutFunction = (logout) => {
    logoutFunction = logout;
};


// Response interceptor: Can thiệp vào response trả về từ server
apiClient.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const status = error.response?.status;
    
    if (status === 401) {
      if (logoutFunction) logoutFunction();
      return Promise.reject(error);
    }

    // nếu nhận 410 (Gone) thì refresh token
    const originalRequest = error.config;
    if (status === 410 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          const response = await apiClient.post(`/auth/refresh-token`, {
            refreshToken,
          });
  
          const newToken = response.data.token;
          await AsyncStorage.setItem('accessToken', newToken);
  
          // Cập nhật token trong headers của request ban đầu
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
  
          // Thử gửi lại request ban đầu
          return apiClient(originalRequest);
        } catch (refreshError) {
          if (logoutFunction) logoutFunction();
          return Promise.reject(refreshError);
        }
    }
 
    // Xử lý riêng các lỗi khác
    if (status >= 400 && status < 500) {
        throw new Error(error.response.data.message || 'Client Error');
    } else if (status >= 500) {
        throw new Error(error.response.data.message || 'Server Error');
    }

    return Promise.reject(error);
});

export default apiClient;