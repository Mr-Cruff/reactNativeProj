/* eslint-disable prettier/prettier */
import {Alert} from 'react-native';

const alert_LoginFailed = (message) => {
  //todo: clear fields on buttonpress
  Alert.alert(
    'Login Failed',
    `${message}, Please Try Again.`,
    [{text: 'OK', onPress: () => console.log('OK')}],
  );
};

export default alert_LoginFailed;
