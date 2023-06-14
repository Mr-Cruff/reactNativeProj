import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text, Image} from 'react-native';

export const Loading = () => {
  return( 
    <View style={styles.container}>
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Image style={{height:'30%', width:'40%', resizeMode:'contain'}}source={require('../resources/ic_launcher_round.png')} />
            <Text style={styles.header}>LOADING</Text>
            {/* <Text style={{fontSize: 16, color:'#959ec0'}}>Fill out fields below to RESET your PASSWORD and move forward</Text> */}
            <Text style={{alignSelf:'center',color:'#959ec0', marginBottom:20}}>Please wait . . .</Text>
          <ActivityIndicator color="#dfb510" size="large" />
        </View>
    </View>
  );
};
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
