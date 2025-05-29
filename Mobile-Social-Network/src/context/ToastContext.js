import React, { createContext, useState, useContext } from 'react';
import Toast  from 'react-native-toast-message';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type, // 'success', 'error', 'info'
      text1: text1,
      text2: text2,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const showError = (message, details) => {
    showToast('error', message || 'Đã xảy ra lỗi', details);
  };

  const showSuccess = (message, details) => {
    showToast('success', message || 'Thành công', details);
  };

  const showInfo = (message, details) => {
    showToast('info', message || 'Thông tin', details);
  };

  const value = {
    showError,
    showSuccess,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
};


export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};