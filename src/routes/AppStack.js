/* eslint-disable prettier/prettier */
import React from 'react';
import Home from '../screens/Home';
import FarmSelect from '../screens/FarmSelect';
import FarmTypeSelect from '../screens/FarmTypeSelect';
import HouseSelect from '../screens/HouseSelect';
import DailyForm from '../screens/DailyForm';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: 'Landing Page', headerShown: false}}
      />
      <Stack.Screen
        name="Farm Type Select"
        component={FarmTypeSelect}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Farm Select"
        component={FarmSelect}
        options={{title: ''}}
      />
      <Stack.Screen
        name="House Select"
        component={HouseSelect}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Daily Form"
        component={DailyForm}
        options={{title: ''}}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
