import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {useAuth} from '../contexts/Auth';
import {ContextProvider} from '../contexts/GlobalContext';
import {tokenValidation} from '../services/AuthService';
import ResetPasswordStack from './ResetPassword';
import {Loading} from '../components/Loading';

const Routes = () => {
  const {authData, loading} = useAuth();
  const {signOut} = useAuth();

  const validateUser = () => {
    if (authData?.token) if (tokenValidation(authData?.token) === false) signOut();
  };

  const RouteValidation = () => {
    if (authData?.token && tokenValidation(authData?.token)) {
      if (authData?.firstLogon === 1) {
        return <ResetPasswordStack />;
      } else return <AppStack />;
    }
    return <AuthStack />;
  };

  return (
    <NavigationContainer
      children={
        <ContextProvider children={!loading ? <RouteValidation /> : <Loading />}></ContextProvider>
      }
      onStateChange={() => validateUser()}></NavigationContainer>
  );
};

export default Routes;
