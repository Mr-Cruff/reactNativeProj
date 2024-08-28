import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

import {getAllItems, getItem1} from '../services/AsyncStorage'

const EditForm = ({navigation, back, form}) => {
  const [forms, setForms] = useState([0]);

  const getItem = async () => {
    try {
      // getAllItems();
      const jsonValue = await AsyncStorage.getItem('@forms');
      console.log(jsonValue)
      jsonValue != null
        ? (() => {
            setForms(JSON.parse(jsonValue));
          })()
        : console.log('Data Not Found!');
    } catch (e) {
      // error reading value
    }
  };

  const handleSubmit = () => {
    // const config = {
    //   headers:{
    //     Authorization: 'Bearer ' + auth.authData.token
    //   }
    // }
    // const submitUrl = `https://devipbformdata.jabgl.com:84/api/FormDetails/submitFormDetails`;
    // const submitResponse = await axios.post(farmUrl,config)
    Alert.alert('Notification', 'Form Submitted');
    navigation.navigate('Home');
  };

  const handleSave = () => {
    Alert.alert('Notification', 'Form Saved');
    navigation.navigate('Home');
  };

  useEffect(() => {
    getItem();
  }, []);

  const newForm = forms[0];
  // console.log(newForm);
  // console.log(Object.keys(newForm));

  return (
    <ScrollView>
      <View
        style={{flex: 1, backgroundColor: '#E0E8FC', paddingHorizontal: 20}}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            marginTop: 20,
            paddingBottom: 5,
            color: '#282C50',
            alignSelf: 'center',
          }}>
          FORM EDIT
        </Text>

        <View>
          {Object.keys(newForm).map((item, index) => {
            if (typeof newForm[item] != 'object') {
              return(
                <View key={index}>
                  <Text>{item}: {newForm[item]}</Text>
                </View>
              );
            }else{
              return (
              <View key={index}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginTop: 20,
                    paddingBottom: 5,
                    color: '#282C50',
                  }}>
                  {item}
                </Text>
                {Object.keys(newForm[item]).map((field, indx) => {
                  if (typeof newForm[item][field] != 'object') {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 20,
                        }}
                        key={indx}>
                        <Text style={{color: 'navy', fontSize: 20}}>
                          {field}:{' '}
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder={item.label}
                          defaultValue={newForm[item][field]}
                          keyboardType={(item.type=='int' || item.type=='float') ? "number-pad":"default"}
                        />
                      </View>
                    );
                  } else {
                    return (
                      <View key={indx}>
                        <Text style={{color: 'navy', fontSize: 20}}>
                          {field}:{' '}
                        </Text>
                        {Object.keys(newForm[item][field]).map(
                          (subField, subIndex) => {
                            // console.log(subField);
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  paddingHorizontal: 20,
                                }}
                                key={subIndex}>
                                <Text style={{color: 'navy', fontSize: 20}}>
                                  {subField}:{' '}
                                </Text>
                                <TextInput
                                  style={styles.input}
                                  placeholder={subField}
                                  defaultValue={newForm[item][field][subField]}
                                />
                              </View>
                            );
                          },
                        )}
                      </View>
                    );
                  }
                })}
              </View>
              );}
          })}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 50,
          }}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
              SAVE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
              SUBMIT
            </Text>
          </TouchableOpacity>
          {/* <Button
          title="delete"
          color="grey"
          onPress={() => {
            handleDelete();
          }}
        /> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default EditForm;

const styles = StyleSheet.create({
  input: {
    color: 'black',
    backgroundColor: 'white',
    height: 45,
    borderBottomWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 20,
    width: 300,
  },
  submitButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#282C50',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    width: 300,
  },
  saveButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#626ab0',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    width: 300,
  },
});
