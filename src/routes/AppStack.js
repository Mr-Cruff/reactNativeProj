/* eslint-disable prettier/prettier */
import React from 'react';
import {createContext,} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import FarmSelect from '../screens/FarmSelect';
import FarmTypeSelect from '../screens/FarmTypeSelect';
import HouseSelect from '../screens/HouseSelect';
import DailyForm from '../screens/DailyForm';
import GeneralForm from '../screens/GeneralForm';
import NewForm from '../screens/NewForm';
// import Culls from '../screens/EditFormDetails';
import FarmHouseSelect from '../screens/FarmHouseSelect';
import ResetPassword from '../screens/ResetPassword';
import RejectedForms from '../screens/RejectedForms';
import EditRejectedForm from '../screens/EditRejectedForm';
import EditForm_Refactored from '../screens/EditForm_Refactor';
import CreateForm from '../screens/CreateForm';
// import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { ContextProvider } from '../contexts/GlobalContext';
import ReviewAndEdit from '../screens/ReviewAndEdit';

const Stack = createStackNavigator();
export const AppStackContext = createContext({});

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
          name="House Select"
          component={HouseSelect}
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
          name="Edit Form"
          component={EditForm_Refactored}
          options={{title: ''}}
        />
        <Stack.Screen
          name="Farm House Select"
          component={FarmHouseSelect}
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
    </Stack.Navigator>
  );
};

export default AppStack;
