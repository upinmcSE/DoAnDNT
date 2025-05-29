import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchData } from '../service/authService';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await AsyncStorage.getItem('accessToken')
        const userData = await fetchData();
        setUser(userData);  
      } catch (error) {
        setUser(null);
        logout()
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const fetchMyUserData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        const userData = await fetchData();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  }

  const login = async (accessToken, refreshToken) => {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      const userData = await fetchData();
      setUser(userData);
    } catch (error) {
      logout()
      setUser(null);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchMyUserData, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;