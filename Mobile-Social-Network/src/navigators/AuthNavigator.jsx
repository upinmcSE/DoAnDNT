import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
  Login,
  Register,
  Launcher,
  ForgotPassword,
  ResetPassword,
  Verify
} from '../screens/auth'

const AuthNavigator = () => {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Launcher"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
      >
      <Stack.Screen name="Launcher" component={Launcher} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Verify" component={Verify} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
