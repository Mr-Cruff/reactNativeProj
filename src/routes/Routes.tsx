/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {useAuth} from '../contexts/Auth.tsx';
//import Loading from './contexts/Loading.tsx';

const Routes = () => {
  const {authData, loading} = useAuth();

  //if (loading) {
  //Seems to be broken
  //return <Loading />;
  //}

  return (
    <NavigationContainer>
      {authData?.token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
