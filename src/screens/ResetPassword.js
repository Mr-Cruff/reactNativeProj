import React, {useEffect, useState} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
// import Header from '../components/Header';
// import {FarmTile} from '../components/Dashboard';
// import {SubFields} from '../components/SubFieldTally';
// import Culls from '../components/formComponents/EditFormCategory';
import axios from 'axios';
import { useAuth } from '../contexts/Auth';
import { AUTH_API } from '../Constants';

const ResetPassword = ({ navigation }) => {
    const auth = useAuth();
    // console.log('ResetPassword');
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        console.log(auth);
    },[]);

    const onPress = async () => {
        setLoading(true);
        if(newPassword === "" || confirmNewPassword === "")
            Alert.alert('ERROR',"Fields CANNOT be empty", [{ text: "OK", onPress: () => setLoading(false) }]);
        else if(newPassword !== confirmNewPassword)
            Alert.alert('ERROR',"Passwords MUST be the same",  [{ text: "OK", onPress: () => setLoading(false) }]);
        else if(newPassword === confirmNewPassword && newPassword !== ""){  
            const {token, uuid, email, password} = auth.authData;
            const config={
                headers:{
                    'Content-Type': "application/json",
                    'Accept': "*/*",
                    Authorization: 'bearer ' + token,
                  },
            };
            const queryBody={
                username: email,
                oldPassword: password,
                password:newPassword,
                confirmPassword:confirmNewPassword,
                firstLogon:0,
            };
            await axios.patch(`${AUTH_API}/api/Auth/ChangePassword?UserId=${uuid}`,queryBody, config)
                .then(async (response) => {
                    // console.log(response.data);
                    if(response.data.success){
                        console.log(response.data.message);
                        await auth.resetFirstLogon();
                    }else{
                        Alert.alert(
                            `Failed`, 
                            `${response.data.message}`, [{ text: "OK", onPress: () => setLoading(false) }]
                        )
                    }
                }).catch((error) => {
                  Alert.alert(`Falied`, `${error.message}`,[{ text: "OK", onPress: () => setLoading(false) }])
                }
            );
        }
        setLoading(false);
    }

    return( 
        <View style={styles.container}>
            <View
                style={{
                paddingTop: 20,
                backgroundColor: 'white',
                }}>

                <Text style={styles.header}>RESET PASSWORD</Text>
            </View>

            <View style={{height:'90%',width:'auto', justifyContent:'center',alignItems:'center',}}>
                <Text style={{fontSize: 30, color:'white'}}>Welcome, {auth.authData.name}</Text>
                <Text style={{fontSize: 16, color:'#959ec0'}}>Fill out fields below to RESET your PASSWORD and move forward</Text>
                <View style={{width:'35%',marginTop:'20%'}}>
                    {/* <Text style={{}}>Enter your OLD password</Text> */}
                    {/* <TextInput
                      style={[styles.TextInput, {borderRadius:10}]}
                      placeholder="OLD Password"
                      placeholderTextColor="#a5adca"
                      secureTextEntry={true}
                      onChangeText={old => setOldPassword(old)}
                    /> */}
                </View>
                <View style={{width:'35%'}}>
                    <Text style={{marginTop:20}}>
                          {/* Enter and confirm your NEW password */}
                     </Text>
                    <TextInput
                      style={[styles.TextInput,{borderTopLeftRadius:10, borderTopRightRadius:10}]}
                      placeholder="NEW Password"
                      placeholderTextColor="#a5adca"
                      secureTextEntry={true}
                      onChangeText={newPass => setNewPassword(newPass)}
                    />
                    <TextInput
                      style={[styles.TextInput,{marginTop:1,borderBottomLeftRadius:10, borderBottomRightRadius:10}]}
                      placeholder="Confirm NEW Password"
                      placeholderTextColor="#a5adca"
                      secureTextEntry={true}
                      onChangeText={ confirm=> setConfirmNewPassword(confirm)}
                    />
                </View>
                <View style={{marginTop:'10%',width:'60%', alignItems:'flex-end'}}>
                {!loading?<TouchableOpacity style={styles.loginBtn} onPress={onPress}>
                        <Text style={{color:'white',fontSize:18}} >
                            SUBMIT
                        </Text>
                    </TouchableOpacity>:<ActivityIndicator size='large' color='#dfb510'/>}
                </View>
            </View>
        </View>
    );
}

export default ResetPassword;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#585D89'
    },
    header:{
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
      backgroundColor:"white",
      elevation:25
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