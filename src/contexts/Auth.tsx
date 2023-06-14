/* eslint-disable prettier/prettier */
import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthData, authService, tokenValidation} from '../services/AuthService';
import LoginFailed from '../components/LoginFailed_Alert';
import ResetPassword from '../screens/ResetPassword';
import { useNavigation } from '@react-navigation/native'

type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(): Promise<void>;
  refreshToken(): boolean;
  signOut(): void;
};

//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({children}) => {
  const [authData, setAuthData] = useState<AuthData>();

  //the AuthContext start with loading equals true
  //and stay like this, until the data be load from Async Storage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call the loadStorage function.
    loadStorageData();
  }, []);
  
  async function loadStorageData(): Promise<void> {
    try {
      //Try get the data from Async Storage
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        //If there is data, it's converted to an Object and the state is updated.
        const _authData: AuthData = JSON.parse(authDataSerialized);
        if(tokenValidation(_authData.token))
          setAuthData(_authData);
      }
    } catch (error) {
    } finally {
      //loading finished
      setLoading(false);
    }
  }

  const signIn = async (email:string, password:string, setIsLoading?:Function) => {
    //call the service passing credential (email and password).
    //In a real App this data will be provided by the user from some InputText components.
    const _authData = await authService.signIn(email, password);
    //

    // const nav = useNavigation();
    // // if(_authData.firstLogon == 0)
    //   navigation.navigate('Reset Password');

    //Set the data in the context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(_authData);

    //Persist the data in the Async Storage
    //to be recovered in the next user session.
    AsyncStorage.setItem('@AuthData', JSON.stringify(_authData));
    //console.log(_authData);

    //check if login failed, disables load icon and displays a login failed alert
    if (_authData.token == '' && setIsLoading) {
      setIsLoading(false);
      // LoginFailed();
    }
  };

  const signOut = async () => {
    //Remove data from context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(undefined);

    //Remove the data from Async Storage
    //to NOT be recoverede in next session.
    await AsyncStorage.removeItem('@AuthData');
  };
 
  const resetFirstLogon = async() =>{
    setLoading(true);
    const {name, token, uuid, email, role, refreshToken} = authData;
    const test:AuthData = {name:name,token:token, uuid:uuid, email:email, password:"", role:role, refreshToken:refreshToken, firstLogon:0}
    setAuthData(test);
    await AsyncStorage.setItem('@AuthData', JSON.stringify(test)).then(()=>setLoading(false));
  };

  const isTokenValid = () => tokenValidation(authData.token);

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <AuthContext.Provider value={{authData, loading, signIn, signOut, isTokenValid, resetFirstLogon}}>
      {children}
    </AuthContext.Provider>
  );
};

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {AuthContext, AuthProvider, useAuth};
