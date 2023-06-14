/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import ResetPassword from '../screens/ResetPassword';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Sign In Screen" component={Login} />
      <Stack.Screen name="Reset Password" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
