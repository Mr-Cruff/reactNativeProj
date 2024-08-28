import React, {useState} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Header from '../components/Header';
import InputField from '../components/InputField';
// import {Formik} from 'formik';

const formFields = [
  {
    Common: {
      'Culls & Mortality': ['Culls', 'Mortality (Male)', 'Mortality (Female)'],
      'Feed Inventory': [
        'Feed Time',
        'Feed Brought Forward',
        'Feed Consumed (lbs) - Male',
      ],
      Miscellaneous: ['Water Consumption', 'Lights', 'Temp Min'],
    },
  },
];

const addForm = form => {
  //unique key
  form.key = Math.random().toString();
};

const handleSave = values => {
  console.log(values);
};
const handleDelete = values => {
  console.log('To be DELETED: ' + JSON.stringify(values));
};

const DailyForm = ({navigation}) => {
  return (
    <View>
      <Header />
      {/* <Formik
        initialValues={{title: '', body: ''}}
        onSubmit={values => {
          console.log(values);
        }}>
        {formikProps => (
          <View>
            <InputField
              placeholder="Enter Title"
              onChangeText={formikProps.handleChange('title')}
              value={formikProps.values.title}
            />
            <Button
              title="submit"
              color="maroon"
              onPress={formikProps.handleSubmit}
            />
            <Button
              title="save"
              color="maroon"
              onPress={() => {
                handleSave(formikProps.values);
              }}
            />
            <Button
              title="delete"
              color="grey"
              onPress={() => {
                handleDelete(formikProps.values);
              }}
            />
          </View>
        )}
      </Formik> */}
    </View>
  );
};

export default DailyForm;
