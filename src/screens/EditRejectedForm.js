// NB: Using the form schema to populate form instead of retrieved for data as to keep hidden fields hidden from the user. This also helps with achieving consistency across the application.
import React, {useEffect, useState, useRef, useMemo, useContext} from 'react';
import {useForm, Controller, reset, FormContext, useFormContext} from 'react-hook-form';
import {useAuth} from '../contexts/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {ActivityIndicator, RadioButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Category,
  executeApiQuery,
  FarmSummary,
  ShowAlert,
  timeConvert,
  timeConverter,
  WhitePlus,
} from '../services/Helpers';
import {CategoryController, saveForm, setFormStatus} from '../services/FormManagement';
// import {Category} from '../components/formComponents/EditFormCategory';
import axios from 'axios';
import {APP_API, ENDPOINTS, FORM_STATUS_OBJ} from '../Constants';
import {GlobalContext} from '../contexts/GlobalContext';
import {getFarmFromAsync} from '../services/AsyncStorage';

// ToDo: Consider adding render animation to make transitions more seamless
//Select form field for reject reason
const EditRejectedForm = ({route, navigation}) => {
  const {formSchema: formFields} = useContext(GlobalContext);
  const {token} = useAuth().authData;
  const [loading, setloading] = useState(false);
  const retrievedForm = JSON.parse(route.params.retrievedForm);
  const {House} = retrievedForm;
  const {farm} = route.params;
  const rejectReasons = route.params.reasons || [];
  const reasons = JSON.parse(rejectReasons);
  const form = useForm({mode: 'onChange'});
  const {formState} = form;

  const onSubmit = data => {
    setloading(true);
    const adjustedForm = {...baseFormDetails, ...data};
    adjustedForm.Status = FORM_STATUS_OBJ[0];
    saveForm(adjustedForm).then(resubmitForm(adjustedForm));
  };

  const getFormFields = () => {
    let header = {};
    Object.keys(retrievedForm).map((field, indx) => {
      if (typeof retrievedForm[field] != 'object') {
        header = {...header, ...{[field]: retrievedForm[field]}};
      }
    });
    return header;
  };

  const resubmitForm = async form => {
    form.Status = setFormStatus(farm);
    const params = {
      formid: form['Form Id'],
    };
    executeApiQuery(ENDPOINTS.FormResubmit, token, 'post', JSON.stringify(form), params)
      .then(response => {
        ShowAlert(`Success`, `Your form has been successfully RESUBMITTED`, [
          {text: 'OK, Close Form', onPress: () => navigation.goBack()},
        ]);
      })
      .catch(error => {
        ShowAlert(
          `Falied`,
          `Your form could NOT be submitted, please try again later.ERROR MESSAGE:${error.message}`,
        );
      });
  };

  const baseFormDetails = getFormFields();

  return (
    <ScrollView style={{backgroundColor: '#E0E8FC'}}>
      <Text style={styles.header}>REJECTED FORM</Text>
      <View
        style={{
          marginHorizontal: '10%',
          backgroundColor: 'white',
          borderWidth: 2,
          borderRadius: 10,
          borderColor: '#81171b',
          paddingBottom: 10,
        }}>
        <Text
          style={{
            backgroundColor: '#81171b',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            paddingHorizontal: 10,
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
            elevation: 1,
          }}>
          Rejection Reasons
        </Text>
        <Text style={{color: '#5e0b15', fontSize: 16, marginHorizontal: 10}}>
          This form was rejected for the following reason(s):
        </Text>
        {reasons.map((reason, idx) => {
          return (
            <Text
              key={idx}
              style={{
                padding: 5,
                marginLeft: 30,
                marginRight: 10,
                fontSize: 16,
                backgroundColor: idx % 2 != 0 ? 'white' : '#f8f9fa',
              }}>
              <Text style={{marginHorizontal: 10, color: '#5e0b15', fontSize: 16}}>
                {idx + 1}.{' '}
              </Text>
              {reasons[idx]}
            </Text>
          );
        })}
      </View>
      <RenderForm
        formFields={formFields}
        retrievedForm={retrievedForm}
        form={form}
        farm={farm}
        house={House}
      />
      {!loading ? (
        <TouchableOpacity
          style={
            formState.isValid
              ? formState.isDirty
                ? styles.button
                : styles.saveButtonDisabled
              : styles.saveButtonDisabled
          }
          disabled={!formState.isValid || !formState.isDirty}
          onPress={e => form.handleSubmit(onSubmit)(e)}>
          <Text
            style={
              formState.isValid
                ? formState.isDirty
                  ? styles.buttonText
                  : {color: 'grey'}
                : {color: 'grey'}
            }>
            SAVE & SUBMIT
          </Text>
        </TouchableOpacity>
      ) : (
        <ActivityIndicator style={{marginVertical: 40}} size="large" color="#282C50" />
      )}
    </ScrollView>
  );
};

export default EditRejectedForm;

const RenderForm = ({formFields, retrievedForm, form, farm, house}) => {
  return (
    <View>
      {Object.keys(formFields).map((key, index) => {
        return (
          <CategoryController
            categorySchema={formFields[key]}
            retrievedData={retrievedForm[formFields[key].title]}
            form={form}
            key={index}
            farm={{...farm, house: house}}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 20,
  },
  header: {
    color: '#560909',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 30,
  },
  button: {
    backgroundColor: '#282C50',
    alignItems: 'center',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    width: 300,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
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
  description: {
    color: '#282C50',
    backgroundColor: 'white',
    height: 150,
    borderWidth: 0,
    borderRadius: 2,
    marginTop: 5,
    fontSize: 16,
    minWidth: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#edede9',
    color: '#white',
    borderColor: '#560909',
    padding: 10,
    borderRadius: 5,
    borderWidth: 4,
    width: 300,
    marginHorizontal: 10,
    marginTop: 30,
    marginBottom: 50,
  },
  saveButtonDisabled: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#edede9',
    color: '#560909',
    borderColor: 'grey',
    padding: 10,
    borderRadius: 5,
    borderWidth: 4,
    width: 200,
    marginHorizontal: 10,
    marginTop: 30,
    marginBottom: 50,
  },
});
