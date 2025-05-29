import apiClient from "./apiClient"

const loginService = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data; // Trả về accessToken và refreshToken
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở tầng trên
  }
};

const fetchData = async () => {
  try {
    const response = await apiClient.get('/user');
    const result = response.data;
    if (result.success) {
      console.log('Data fetched successfully:', result.data);
      return result.data;

    } else {
      return result.message
    }
  } catch (error) {
    return 'Lỗi khi gọi API:', error.response?.data || error.message;
  }
}

const registerService = async (name, email, password) => {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response 
  } catch (error) {
    throw error;
  }
}

const verifyCodeService = async (email, code) => {
  try {
    const response = await apiClient.post('/auth/verify-code', { email, code });
    return response;
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở tầng trên
  }
}

const resetCodeService = async (email) => {
  try {
    const response = await apiClient.post('/auth/resend-code', { email });
    return response;
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở tầng trên
  }
}

const forgotPasswordService = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    throw error;
  }
}

export {
  loginService,
  fetchData,
  registerService,
  verifyCodeService,
  resetCodeService,
  forgotPasswordService
}