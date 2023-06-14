import React, { useEffect } from 'react';
import Routes from './src/routes/Routes';
import {AuthProvider} from './src/contexts/Auth.tsx';
import SplashScreen from "react-native-splash-screen";

const App = () => {

  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);
  
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
