import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

export const getAllItems = async () => {
  let keys = [];

  keys = await AsyncStorage.getAllKeys();

  keys.map(item => {
    console.log(item);
  });
  // example console.log result:
  // ['@MyApp_user', '@MyApp_key']
};

export const getItem = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@forms');
    jsonValue != null
      ? (() => {
          console.log('async: ===============================');
          // console.log(JSON.parse(jsonValue));
          return (JSON.parse(jsonValue));
        })()
      : console.log('Data Not Found!');
  } catch (e) {
    // error reading value
  }
};

export const storeForm = async value => {
  const jsonValue = JSON.stringify(value);
  try {
    if (checkForms()) {
      await AsyncStorage.setItem('@forms', jsonValue);
    }
  } catch (e) {
    // saving error
  }
};

async function checkForms() {
  //let context = this;
  try {
    let value = await AsyncStorage.getItem('forms');
    if (value != null) {
      // do something
      return true;
    }
    // do something else
    return false;
  } catch (error) {
    // Error retrieving data
    console.log(error);
  }
}

export const deleteFormByFormId = async (formId) =>{
  const storedForms = await AsyncStorage.getItem('@forms');
  let storedFormsParsed = JSON.parse(storedForms);
  let found=false;
  
  if (storedForms !== null) {
    storedFormsParsed.map(async (asyncForm, formIndex) => {
      if(storedFormsParsed[formIndex]['Form Id']==formId){
        storedFormsParsed.splice(formIndex,1);
        // storedFormsParsed[formIndex] = {...storedFormsParsed[formIndex], ...form};
        setAllForms(storedFormsParsed);
        found=true;
        try{
          await AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed));
        }catch(e){
          Alert.alert(e);
        }
      }
    });
    if(!found){
      Alert.alert(`Error`, "Form cannot be deleted at this time")
    }
  } 
}

export const getAllForms = async () => {
  try {
    const forms = await AsyncStorage.getItem('@forms');
    const jsonValue = JSON.parse(forms);
    if (jsonValue != null) {
      return jsonValue;
    } else {
      console.log('Data Not Found!');
    }
  } catch (e) {
    console.log(`Error retrieving forms from storage.\nError:${e}`);
  }
};

export const getAllFormIds = async ()=>{
  const forms = await getAllForms();
  let formIds = [];
  for(let form in forms){
    formIds.push(forms[form]['Form Id'])
  }
  return formIds;
}

export const doesFormExist = async (formId) => {
  const formsIds = await getAllFormIds();
  // console.log(formsIds.includes(formId))
  // console.log(formsIds);
  // console.log("New Id: "+formId);
  return formsIds.includes(formId); 
}
// interface App{
//     AuthData{

//     },
//     User{

//     },
//     AppData{

//     }
// }

// Save Form to Asycn Storage
// 1. Check if @forms exists in async storage
//    - if it exists then continue
//    - if not then create it and continue
// 2. Get @forms array, JSON.parse  and Iterate over @forms array to find form with similar formId
// 3. get form with form id and iterate over categories to update accordingly.
//  ----- OR -----
// 3.  
export const saveForm = async (form) => {
  let found=false;
  const arrForm = [form];
  console.log(form);
  const storedForms = await AsyncStorage.getItem('@forms');
  let storedFormsParsed = JSON.parse(storedForms);
  let updatedForm={};
  
  if (storedForms !== null) {
    storedFormsParsed.map(async (asyncForm, formIndex) => {
      if(storedFormsParsed[formIndex]['Form Id']==form['Form Id']){
        found=true;
        Object.keys(storedFormsParsed[formIndex]).map((key, idx)=>{
          if (typeof storedFormsParsed[formIndex][key] == 'object'){
            // console.log(key);
            storedFormsParsed[formIndex][key] = {...storedFormsParsed[formIndex][key], ...form[key]};
            // console.log(storedFormsParsed[formIndex][key]);
          }
          // console.log(typeof storedFormsParsed[formIndex][key] =='object' && storedFormsParsed[formIndex][key] )
        });
        // storedFormsParsed[formIndex] = {...storedFormsParsed[formIndex], ...form};
        // console.log(storedFormsParsed[formIndex]);
        updatedForm = storedFormsParsed[formIndex];
        try{
          // console.log(JSON.stringify(storedFormsParsed[formIndex]));
          await AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed));
        }catch(e){
          Alert.alert(e);
        }
      }
    });

    if(!found){
      // console.log("this");
      let x = [...storedFormsParsed, ...arrForm]
      await AsyncStorage.setItem('@forms', JSON.stringify(x));
    }

  } else {
    try {
      await AsyncStorage.setItem('@forms', JSON.stringify(arrForm));
    } catch (error) {
      //errorrr
    }
  }
  return updatedForm;
};

export const storeFarms = async (uuid, farms)=>{
  // console.log('======== Store Farms ========');
  // console.log(uuid);
  const userFarms = {[uuid]:farms}
  try{
    // console.log(JSON.stringify(userFarms));
    await AsyncStorage.setItem('@farms', JSON.stringify(userFarms));
    // return true;
  }catch(e){
    // Alert.alert(e);
    return false;
  }
}

// get farms from async that belong to user, by id
export const getFarmsFromAsync = async (uuid) => {
  // console.log('============ Gettinmg farms from ASYNC =================');
  // console.log(uuid);
  let arr;
  try {
    const stringValue = await AsyncStorage.getItem('@farms');
    // console.log(stringValue);
    stringValue != null
      ? (() => {
          // console.log('async: ===============================');
          // console.log(JSON.parse(jsonValue)[`${uuid}`]);
          // let arr;
          const jsonValue = JSON.parse(stringValue);
          Object.keys(jsonValue).map((key, idx)=>{
            // console.log(key);
            if(key === uuid)
             arr=jsonValue[uuid];
              // return jsonValue[uuid];
          })
        })()
        : undefined;
    return arr;
  } catch (e) {
    // error reading value
    return null;
  }
};

export const getFarmFromAsync = async (uuid, name) =>{
  const farms = await getFarmsFromAsync(uuid);
  let farm;
  farms && Object.keys(farms).map((idx)=>{
    if(farms[idx].name == name)
      farm= farms[idx];
  })
  return farm;
}
