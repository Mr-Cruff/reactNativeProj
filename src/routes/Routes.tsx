/* eslint-disable prettier/prettier */
import React,{useEffect, useState} from 'react';
// import {Text} from 'react-native';
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
        // console.log("Reset Password Block: "+authData?.firstLogon);
        return <ResetPasswordStack />;
      }
      else
        return <AdminStack />;
    }
    return <AuthStack />;
  };

  //authData?.token ? <AppStack /> : <AuthStack />
  return <NavigationContainer children={<ContextProvider children={!loading?<RouteValidation />:<Loading />}></ContextProvider>} onStateChange={()=>validateUser()}></NavigationContainer>;
};

export default Routes;
