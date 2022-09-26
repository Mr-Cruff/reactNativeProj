/* eslint-disable prettier/prettier */
<<<<<<< HEAD
import React,{useEffect, useState} from 'react';
// import {Text} from 'react-native';
=======
import React from 'react';
import {Text} from 'react-native';
>>>>>>> 3826207 (merge)
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AdminStack from './AdminStack';
import AuthStack from './AuthStack';
import {useAuth} from '../contexts/Auth';
import { ContextProvider } from '../contexts/GlobalContext';
import { tokenValidation } from '../services/AuthService';
import ResetPasswordStack from './ResetPassword';
import { ActivityIndicator } from 'react-native-paper';
import {Loading} from '../components/Loading';

const Routes = () => {
  const {authData, loading} = useAuth();
  // const [resetPassword, setResetPassword] = useState(false);
  // const [loading, setLoading] = useState(true);
  const {signOut} = useAuth();

  //if (loading) {
  //Seems to be broken
  //return <Loading />;
  //}

<<<<<<< HEAD
  // useEffect(()=>{
  //   const showResetScreen = () =>{
  //     if(authData?.firstLogon === 1){
  //     setResetPassword(true);
  //   }else{
  //     }setResetPassword(false);
  //   }
  //   showResetScreen();
  // },[authData?.firstLogon]);

  const validateUser = () => {
    if(authData?.token)
      if(tokenValidation(authData?.token) === false)
        signOut();
  }

  const RouteValidation = () => {
    if (authData?.token && tokenValidation(authData?.token)) {
      if(authData?.firstLogon === 1){
        console.log("Reset Password Block: "+authData?.firstLogon);
        return <ResetPasswordStack />;
      }
      else
        return <AdminStack />;
    }
    return <AuthStack />;
  };

  //authData?.token ? <AppStack /> : <AuthStack />
  return <NavigationContainer children={<ContextProvider children={!loading?<RouteValidation />:<Loading />}></ContextProvider>} onStateChange={()=>validateUser()}></NavigationContainer>;
=======
  const routeValidation = () => {
    if (authData?.token) {
      //console.log('routeValidation: ' + JSON.stringify(authData));
      if (authData.role == 'basic') {
        return <AppStack />;
      } else {
        return <AdminStack />;
      }
    }
    return <AuthStack />;
  };
  //authData?.token ? <AppStack /> : <AuthStack />
  return <NavigationContainer>{routeValidation()}</NavigationContainer>;
>>>>>>> 3826207 (merge)
};

export default Routes;
