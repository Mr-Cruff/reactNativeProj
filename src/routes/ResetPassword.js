/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ResetPassword from '../screens/ResetPassword';

const Stack = createStackNavigator();

const ResetPasswordStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Reset Password" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default ResetPasswordStack;