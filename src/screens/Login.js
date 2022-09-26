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
  ImageBackground,
} from 'react-native';
import {useAuth} from '../contexts/Auth';

//SIGN IN SCREEN
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShow] = useState(true);
  const auth = useAuth();
  const [loading, isLoading] = useState(false);

  const backImage = require('../resources/backgroundImage.png');

  const setIsLoading = x => {
    isLoading(x);
  };

  const signIn = async () => {
    isLoading(true);
    await auth.signIn(email, password, setIsLoading);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backImage} style={styles.backImage}>
        <View style={styles.div}>
          <Image
            style={styles.image}
<<<<<<< HEAD
            source={require('../resources/ipbFull.jpg')}
          />
          {/* <Text>Enter use info</Text> */}
=======
            source={require('../resources/ipb.jpg')}
          />
>>>>>>> 3826207 (merge)
          <View style={styles.inputView}>
            <Image
              style={styles.imageStyle}
              source={require('../resources/avatar.png')}
            />
            <TextInput
<<<<<<< HEAD
              style={[styles.TextInput, {flex:1}]}
              autoCapitalize="none"
              placeholder="Email Address"
=======
              style={styles.TextInput}
              placeholder="Email"
>>>>>>> 3826207 (merge)
              placeholderTextColor="#efefef"
              // eslint-disable-next-line no-shadow
              onChangeText={email => setEmail(email)}
            />
          </View>
<<<<<<< HEAD
          <View style={[styles.inputView,{}]}>
=======
          <View style={styles.inputView}>
>>>>>>> 3826207 (merge)
            <Image
              style={styles.imageStyle}
              source={require('../resources/lock.png')}
            />
            <TextInput
<<<<<<< HEAD
              style={[styles.TextInput, {flex:1}]}
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor="#efefef"
              secureTextEntry={showPassword}
              // eslint-disable-next-line no-shadow
              onChangeText={password => setPassword(password)}
            />
            <TouchableOpacity style={{padding:10, color:'grey'}} onPress={()=>setShow(!showPassword)}><Text style={{color:"#efefef"}} >{showPassword?"SHOW":"HIDE"}</Text></TouchableOpacity>
=======
              style={styles.TextInput}
              placeholder="Password"
              placeholderTextColor="#efefef"
              secureTextEntry={true}
              // eslint-disable-next-line no-shadow
              onChangeText={password => setPassword(password)}
            />
>>>>>>> 3826207 (merge)
          </View>

          {loading ? (
            <ActivityIndicator color={'#000'} animating={true} size="small" />
          ) : (
<<<<<<< HEAD
            <TouchableOpacity style={styles.loginBtn} onPress={signIn}>
              <Text style={styles.loginText} >
=======
            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginText} onPress={signIn}>
>>>>>>> 3826207 (merge)
                LOGIN
              </Text>
              {/*<Button title="Sign In" style={styles.loginBtn} onPress={signIn}*/}
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  div: {
    backgroundColor: '#EBF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    width: 400,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
    elevation: 5,
  },

  image: {
    marginBottom: 40,
  },

  backImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#ffff',
    fontSize: 18,
    padding: 10,
    marginLeft: 10,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginText: {
    color: '#ffff',
  },

  loginBtn: {
    width: 300,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#9D8D62',
  },
  imageStyle: {
    // padding: 10,
    marginLeft: 30,
    height: 25,
    width: 25,
    // resizeMode: 'stretch',
    // alignItems: 'center',
  },
});

export default Login;
