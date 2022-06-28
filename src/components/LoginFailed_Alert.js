/* eslint-disable prettier/prettier */
import {Alert} from 'react-native';

const alert_LoginFailed = () => {
  //todo: clear fields on buttonpress
  Alert.alert(
    'Login Failed',
    'Incorrect Credentials Entered, Please Try Again.',
    [{text: 'OK', onPress: () => console.log('OK')}],
  );
};

export default alert_LoginFailed;
