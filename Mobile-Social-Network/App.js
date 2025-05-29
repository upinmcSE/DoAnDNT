import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigators/RootNavigator';
import React, { useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { setLogoutFunction } from './src/service/apiClient';
import { ToastProvider } from './src/context/ToastContext';
import { ThemeProvider } from "./src/context/ThemeContext";
import { SocketProvider } from './src/context/SocketContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <ToastProvider>
            <MainApp />
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const MainApp = () => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    setLogoutFunction(logout);
  }, [logout]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};
