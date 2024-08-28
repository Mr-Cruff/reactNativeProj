import React, {createContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import EditFormSelect from '../screens/EditFormSelect';
import FarmHouseSelect from '../screens/FarmHouseSelect';
import ReviewForm from '../screens/FormReviewRouting';
import FormReview from '../screens/FormReview';
import ResetPassword from '../screens/ResetPassword';
import EditRejectedForm from '../screens/EditRejectedForm';
import EditFormScreen from '../screens/EditFormScreen';
import CreateForm from '../screens/CreateForm';
import ReviewAndEdit from '../screens/ReviewAndEdit';
import EggDelivery from '../screens/EggDelivery';
import BirdsCapitalized from '../screens/BirdsCapitalized';

const noTitle = {title: ''};

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
      <Stack.Screen name="Farm House Select" component={FarmHouseSelect} options={noTitle} />
      <Stack.Screen name="Edit Form Select" component={EditFormSelect} options={noTitle} />
      <Stack.Screen name="Edit Form" component={EditFormScreen} options={noTitle} />
      <Stack.Screen name="Review Form" component={ReviewForm} options={noTitle} />
      <Stack.Screen name="Form Review" component={FormReview} options={noTitle} />
      <Stack.Screen name="Reset Password" component={ResetPassword} options={noTitle} />
      <Stack.Screen name="Edit Rejected Form" component={EditRejectedForm} options={noTitle} />
      <Stack.Screen name="Create Form" component={CreateForm} options={noTitle} />
      <Stack.Screen name="Review and Edit" component={ReviewAndEdit} options={noTitle} />
      <Stack.Screen name="Egg Delivery" component={EggDelivery} options={noTitle} />
      <Stack.Screen name="Birds Capitalized" component={BirdsCapitalized} options={noTitle} />
    </Stack.Navigator>
  );
};

export default AppStack;
