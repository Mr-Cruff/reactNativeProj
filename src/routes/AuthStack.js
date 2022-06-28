/* eslint-disable prettier/prettier */
import React from 'react';
import Login from '../screens/Login';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Sign In Screen" component={Login} />
    </Stack.Navigator>
  );
};

export default AuthStack;
