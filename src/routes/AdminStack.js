/* eslint-disable prettier/prettier */
import React,{createContext, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import FarmSelect from '../screens/FarmSelect';
import FarmTypeSelect from '../screens/FarmTypeSelect';
import DailyForm from '../screens/DailyForm';
import GeneralForm from '../screens/GeneralForm';
import NewForm from '../screens/NewForm';
import EditFormSelect from '../screens/EditFormSelect';
import FarmHouseSelect from '../screens/FarmHouseSelect';
import ReviewForm from '../screens/ReviewForm';
import FormReview from '../screens/FormReview_Refactored';
import ResetPassword from '../screens/ResetPassword';
import RejectedForms from '../screens/RejectedForms';
import EditRejectedForm from '../screens/EditRejectedForm';
import EditForm_Refactored from '../screens/EditForm_Refactor';
import CreateForm from '../screens/CreateForm';
import ReviewAndEdit from '../screens/ReviewAndEdit';
import EggDelivery from '../screens/EggDelivery';
import BirdsCapitalized from '../screens/BirdsCapitalized';

const Stack = createStackNavigator();
export const AppStackContext = createContext();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Landing Page',
          headerShown: false,
          background: '#efefef',
          transparentCard: true,
          cardStyle: {opacity: 1},
        }}
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
        name="Farm House Select"
        component={FarmHouseSelect}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Daily Form"
        component={DailyForm}
        options={{title: ''}}
      />
      <Stack.Screen
        name="General Form"
        component={GeneralForm}
        options={{title: ''}}
      />
      <Stack.Screen name="New Form" component={NewForm} options={{title: ''}} />
      <Stack.Screen
        name="Edit Form Select"
        component={EditFormSelect}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Edit Form"
        component={EditForm_Refactored}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Review Form"
        component={ReviewForm}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Form Review"
        component={FormReview}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Reset Password"
        component={ResetPassword}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Rejected Forms"
        component={RejectedForms}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Edit Rejected Form"
        component={EditRejectedForm}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Create Form"
        component={CreateForm}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Review and Edit"
        component={ReviewAndEdit}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Egg Delivery"
        component={EggDelivery}
        options={{title: ''}}
      />
      <Stack.Screen
        name="Birds Capitalized"
        component={BirdsCapitalized}
        options={{title: ''}}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
