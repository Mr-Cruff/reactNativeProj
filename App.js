import React from 'react';
import Routes from './src/routes/Routes';
import {AuthProvider} from './src/contexts/Auth.tsx';

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
