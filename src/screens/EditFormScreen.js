// NB: Using the form schema to populate form instead of retrieved for data as to keep hidden fields hidden from the user. This also helps with achieving consistency across the application.
import React, {useState, useContext} from 'react';
import {useForm} from 'react-hook-form';
import {useAuth} from '../contexts/Auth';
import {
  Text,
  // TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  FarmSummary,
  executeApiQuery,
  ShowAlert,
  convertToCSharpCompatibleFormat,
  isObjectEmpty,
  FormSummary,
} from '../services/Helpers';

import {FORM_STATUS_OBJ} from '../Constants';
import {GlobalContext, farms} from '../contexts/GlobalContext';
import {ENDPOINTS} from '../Constants';
import {CategoryController, saveForm, setFormStatus} from '../services/FormManagement';
import LoadingScreen from '../components/LoadingModal';

// ToDo: Consider adding render animation to make transitions more seamless
const EditFormScreen = ({route, navigation}) => {
  const {formSchema: formFields} = useContext(GlobalContext);
  const {token} = useAuth().authData;
  const [loading, setloading] = useState(false);
  const retrievedForm = route.params.formSelected;
  const {Status: formStatus} = retrievedForm;
  const {Farm, House} = route.params.farmSelected;

  const form = useForm({mode: 'onChange'});
  const {formState} = form;

  let header = {};
  let categories = {};

  const getFormFields = () => {
    Object.keys(retrievedForm).map((field, indx) => {
      if (typeof retrievedForm[field] != 'object') {
        header = {...header, ...{[field]: retrievedForm[field]}};
      } else {
        categories = {...categories, [field]: retrievedForm[field]};
      }
    });
  };

  const onSubmit = data => {
    setloading(true);
    const adjustedForm = {
      ...baseFormDetails,
      ...data,
      'Date Submitted': convertToCSharpCompatibleFormat(new Date()),
    };

    if (adjustedForm.Status != FORM_STATUS_OBJ[0] || adjustedForm.Status != FORM_STATUS_OBJ[1]) {
      adjustedForm.Status = setFormStatus(Farm);
      saveForm(adjustedForm).then(updatedForm => {
        SubmitForm(updatedForm);
      });
    } else {
      adjustedForm.Status = setFormStatus(Farm);
      SubmitForm(adjustedForm);
    }
  };

  const SubmitForm = async form => {
    executeApiQuery(ENDPOINTS.FormSubmit, token, 'post', JSON.stringify(form), undefined).then(
      response => {
        if (response.status == 200) {
          ShowAlert(`Success`, `Your form has been successfully SUBMITTED`, [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
        } else {
          const isSubmitted =
            response?.response?.data?.message ===
              'Error -> A record was already created for that Flock and Date. Please check your information and try again' ||
            response?.response?.data?.message ===
              'Error -> That Form ID was already submitted. Please check your details and try again';
          let adjustedForm = {...form};
          if (!isSubmitted) {
            adjustedForm = {...form, 'Date Submitted': ' - ', Status: FORM_STATUS_OBJ[-1]};
            saveForm(adjustedForm);
          } else {
            adjustedForm.Status = FORM_STATUS_OBJ[0];
          }
          ShowAlert(
            `Failed`,
            `${
              response?.response?.data?.message
                ? response.response.data.message
                : response || 'NO Error Code Found'
            }`,
          );
        }
        setloading(false);
      },
    );
  };

  const onSave = data => {
    const adjustedForm = {...baseFormDetails, ...data};
    adjustedForm.Status = FORM_STATUS_OBJ[-1];
    console.log('On Save: ');
    console.log(adjustedForm);
    saveForm(adjustedForm).then(() => {
      ShowAlert(`Success`, `Your form has been successfully SAVED`, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      setloading(false);
    });
  };

  getFormFields();
  const baseFormDetails = header;
  let canSubmit = isObjectEmpty(formState.errors);

  return (
    <ScrollView style={{backgroundColor: '#E0E8FC'}}>
      <Text style={styles.header}>EDIT FORM</Text>
      <FarmSummary props={{Farm, House, form: baseFormDetails}} />

      <RenderForm
        formFields={formFields}
        retrievedForm={categories}
        form={form}
        farm={Farm}
        house={House.house}
      />

      {!loading ? (
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          {formStatus != FORM_STATUS_OBJ[0] && (
            <TouchableOpacity
              style={
                !formState.isDirty
                  ? styles.saveButtonDisabled
                  : !formState.isValid
                  ? styles.button
                  : styles.saveButtonDisabled
              }
              disabled={formState.isValid || !formState.isDirty}
              onPress={e => {
                setloading(true);
                onSave(form.getValues());
              }}>
              <Text
                style={
                  !formState.isDirty
                    ? {color: 'grey'}
                    : !formState.isValid
                    ? styles.buttonText
                    : {color: 'grey'}
                }>
                SAVE
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={formState.isValid && canSubmit ? styles.button : styles.saveButtonDisabled}
            disabled={!formState.isValid || !canSubmit}
            onPress={e => form.handleSubmit(onSubmit)(e)}>
            <Text style={formState.isValid && canSubmit ? styles.buttonText : {color: 'grey'}}>
              {formStatus != FORM_STATUS_OBJ[0] ? 'SAVE & SUBMIT' : 'SUBMIT'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <LoadingScreen />
      )}
    </ScrollView>
  );
};

export default EditFormScreen;

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
            farm={{...farm, ...{house: house}}}
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
    color: '#282C50',
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
