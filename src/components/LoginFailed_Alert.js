/* eslint-disable prettier/prettier */
import {Alert} from 'react-native';

const alert_LoginFailed = (data) => {
  //todo: clear fields on buttonpress
  const { status, message } = data;
  if(message){
    Alert.alert(
      `Login Failed ${status? " - " + status : ""}`,
      `${message}`,
      [{text: 'OK'}],
    );
  }else{
    const errs = data?.response?.data?.errors || data;
    const showErrors =(errsObj)=>{
      return Object.keys(errsObj).map((err, idx)=>`${err} - ${errsObj[err]}`)
    }
    // showErrors(errs)
    Alert.alert(
      `Login Failed - ${status}`,
      `${showErrors(errs)}, Please Try Again.`,
      [{text: 'OK', onPress: () => console.log('OK')}],
    );
  }
};

export default alert_LoginFailed;
