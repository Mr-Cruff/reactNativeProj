import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {useAuth} from '../contexts/Auth';
import {AUTH_API, ENDPOINTS} from '../Constants';
import {ShowAlert} from '../services/Helpers';
import LoadingScreen from '../components/LoadingModal';

const ResetPassword = ({navigation}) => {
  const auth = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(auth);
  }, []);

  const passwordValidation = (newPassword, confirmNewPassword) => {
    'Passwords must be at least 8 characters and contain the following: upper case (A-Z), lower case (a-z) and number (0-9)',
      (MinimumLength = 8);
    '^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])).{8,}$',
      'Passwords must be at least 8 characters and contain the following: upper case (A-Z), lower case (a-z) and number (0-9)';
  };

  const onPress = async () => {
    setLoading(true);
    if (newPassword === '' || confirmNewPassword === '')
      ShowAlert('ERROR', 'Fields CANNOT be empty', [
        {text: 'OK', onPress: () => setLoading(false)},
      ]);
    else if (newPassword.length < 8)
      ShowAlert('ERROR', 'Password must be at least 8 characters', [
        {text: 'OK', onPress: () => setLoading(false)},
      ]);
    else if (newPassword !== confirmNewPassword)
      ShowAlert('ERROR', 'Passwords MUST be the same', [
        {text: 'OK', onPress: () => setLoading(false)},
      ]);
    else if (newPassword === confirmNewPassword && newPassword !== '') {
      const {token, uuid, email, password} = auth.authData;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: 'bearer ' + token,
        },
      };
      const queryBody = {
        username: email,
        oldPassword: password,
        password: newPassword,
        confirmPassword: confirmNewPassword,
        firstLogon: 0,
      };
      await axios
        .patch(`${AUTH_API}${ENDPOINTS.ResetPassword}${uuid}`, queryBody, config)
        .then(async response => {
          if (response.data.success) {
            await auth.resetFirstLogon();
          } else {
            ShowAlert(`Failed`, `${response.data.message}`, [
              {text: 'OK', onPress: () => setLoading(false)},
            ]);
          }
        })
        .catch(error => {
          ShowAlert(`Falied`, `${error.message}`, [{text: 'OK', onPress: () => setLoading(false)}]);
        });
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingTop: 20,
          backgroundColor: 'white',
        }}>
        <Text style={styles.header}>RESET PASSWORD</Text>
      </View>

      <View style={{height: '90%', width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 30, color: 'white'}}>Welcome, {auth.authData.name}</Text>
        <Text style={{fontSize: 16, color: '#959ec0'}}>
          Fill out fields below to RESET your PASSWORD and move forward
        </Text>
        <View style={{width: '35%', marginTop: '20%'}}></View>
        <View style={{width: '35%'}}>
          <Text style={{marginTop: 20}}>{/* Enter and confirm your NEW password */}</Text>
          <TextInput
            style={[styles.TextInput, {borderTopLeftRadius: 10, borderTopRightRadius: 10}]}
            placeholder="NEW Password"
            placeholderTextColor="#a5adca"
            secureTextEntry={true}
            onChangeText={newPass => setNewPassword(newPass)}
          />
          <TextInput
            style={[
              styles.TextInput,
              {marginTop: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10},
            ]}
            placeholder="Confirm NEW Password"
            placeholderTextColor="#a5adca"
            secureTextEntry={true}
            onChangeText={confirm => setConfirmNewPassword(confirm)}
          />
        </View>
        <View style={{marginTop: '10%', width: '60%', alignItems: 'flex-end'}}>
          {!loading ? (
            <TouchableOpacity style={styles.loginBtn} onPress={onPress}>
              <Text style={{color: 'white', fontSize: 18}}>SUBMIT</Text>
            </TouchableOpacity>
          ) : (
            <LoadingScreen />
          )}
        </View>
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#585D89',
  },
  header: {
    color: '#282C50',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  div: {
    elevation: 5,
  },

  inputView: {
    flexDirection: 'row',
    backgroundColor: '#585D89',
    borderRadius: 10,
    width: 300,
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },

  TextInput: {
    fontSize: 18,
    padding: 10,
    marginLeft: 10,
    backgroundColor: 'white',
    elevation: 25,
  },
  loginBtn: {
    width: 150,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#dfb510',
  },
});
