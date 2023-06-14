import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {useForm, Controller, reset} from 'react-hook-form';

export const SubFields = () => {
    const {
        control,
        handleSubmit,
    } = useForm({mode: 'onBlur'})

    // const onSubmit = data => {
    //     console.log(data);

    //     // Object.keys(data).map((item, index) => {
    //     //     console.log(data[item]);
    //     //     (typeof data[item] != 'undefined') ? total =Number(total)+Number(data[item]):'';
    //     // })

    //     const newData = {...data, total:total};
    //     console.log(newData);
    // };
    // const [total,setTotal] = useState(0);
    const [val1,setVal1] =  useState(0);
    const [val2,setVal2] =  useState(0);
    const [val3,setVal3] =  useState(0);
    const [val4,setVal4] =  useState(0);
    let total=val1+val2+val3+val4;
    //let val2;
    return(
        <View style={styles.container}>
            <Controller        
               control={control}   
               defaultValue=""    
               name="Entry1"        
               render={({field: {onChange, value, onBlur}}) => (            
                 <TextInput                    
                   style={styles.input}
                   placeholder="Enter 1st Entry"            
                   value={value}            
                   onBlur={onBlur}          
                   keyboardType="number-pad"  
                   onChangeText={value => {setVal1(Number(value));return onChange(value)}}          
                 />        
               )} 
            />
            <Controller        
               control={control}  
               defaultValue=""        
               name="2nd Entry"        
               render={({field: {onChange, value, onBlur}}) => (            
                 <TextInput                    
                   style={styles.input}
                   placeholder="Enter 2nd Entry"            
                   value={value}            
                   onBlur={onBlur}        
                   keyboardType="number-pad"    
                   onChangeText={value => {setVal2(Number(value));return onChange(value)}}          
                 />        
               )} 
            />
            <Controller        
               control={control}  
               defaultValue=""        
               name="3rd Entry"        
               render={({field: {onChange, value, onBlur}}) => (            
                 <TextInput 
                   style={styles.input}                   
                   placeholder="Enter 3rd Entry"            
                   value={value}            
                   onBlur={onBlur}  
                   keyboardType="number-pad"          
                   onChangeText={value => {setVal3(Number(value));return onChange(value)}}          
                 />        
               )} 
            />
            <Controller        
               control={control} 
               defaultValue=""         
               name="4th Entry"        
               render={({field: {onChange, value, onBlur}}) => (            
                 <TextInput      
                   style={styles.input}              
                   placeholder="Enter 3rd Entry"            
                   value={value}            
                   onBlur={onBlur} 
                   keyboardType="number-pad"           
                   onChangeText={value => {setVal4(Number(value));return onChange(value)}}          
                 />        
               )} 
            />
            <Text>{total}</Text>
            {/* <Button title='Submit' onPress={handleSubmit(onSubmit)}/> */}
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    color: '#282C50',
    backgroundColor: 'white',
    height: 50,
    borderWidth: 0,
    borderRadius: 2,
    marginTop: 5,
    fontSize: 16,
    minWidth: 150,
  },
});