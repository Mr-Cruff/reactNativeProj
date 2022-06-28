/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {useAuth} from '../contexts/Auth';

//SIGN IN SCREEN
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const [loading, isLoading] = useState(false);

  const setIsLoading = x => {
    isLoading(x);
  };

  const signIn = async () => {
    isLoading(true);
    await auth.signIn(email, password, setIsLoading);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../resources/ipb.jpg')} />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email."
          placeholderTextColor="#003f5c"
          // eslint-disable-next-line no-shadow
          onChangeText={email => setEmail(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          // eslint-disable-next-line no-shadow
          onChangeText={password => setPassword(password)}
        />
      </View>
      {loading ? (
        <ActivityIndicator color={'#000'} animating={true} size="small" />
      ) : (
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText} onPress={signIn}>
            LOGIN
          </Text>
          {/*<Button title="Sign In" style={styles.loginBtn} onPress={signIn}*/}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    marginBottom: 40,
  },

  inputView: {
    backgroundColor: '#FFC0CB',
    borderRadius: 30,
    width: '50%',
    height: 45,
    marginBottom: 20,

    alignItems: 'center',
  },

  TextInput: {
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    width: '60%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#FF1493',
  },
});

export default Login;
