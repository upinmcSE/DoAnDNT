import React, { useContext } from 'react';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import { AuthContext } from '../context/AuthContext';

const RootNavigator = () => {
  const { user } = useContext(AuthContext);

  return user ? <BottomTabNavigator /> : <AuthNavigator />;
};

export default RootNavigator;
