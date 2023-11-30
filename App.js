import React, { useEffect } from 'react';
import Routes from './src/routes/Routes';
import {AuthProvider} from './src/contexts/Auth.tsx';
import SplashScreen from "react-native-splash-screen";
// import messaging from '@react-native-firebase/messaging';
import { Text, View, Button, Platform,PermissionsAndroid, Alert } from 'react-native';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION);

const App = () => {

  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  useEffect(() => {
    console.log('App is Loaded');
    // if(requestUserPermission()){
    //   // prints fcm token for the device
    //   messaging().getToken().then(token => console.log(token))
    // }
    // // Check whether an initial notification is available
    // messaging()
    // .getInitialNotification()
    // .then(remoteMessage => {
    //   if (remoteMessage)
    //     console.log('Notification caused app to open from quit state:', remoteMessage.notification,);
    // });
      
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log('Notification caused app to open from background state:', remoteMessage.notification,);
    // });
        
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    //   console.log(remoteMessage);
    // });
    SplashScreen.hide(); //hides the splash screen on app load.
    // return unsubscribe;
  }, []);
  
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
