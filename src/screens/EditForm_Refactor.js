// NB: Using the form schema to populate form instead of retrieved for data as to keep hidden fields hidden from the user. This also helps with achieving consistency across the application.
import React, {useState, useRef, useMemo, useContext, useEffect} from 'react';
import {useForm,} from 'react-hook-form';
import {useAuth} from '../contexts/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Alert,
    // Button,
    Text,
    // TextInput,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
  } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
// import DateTimePicker from '@react-native-community/datetimepicker';
import {FarmSummary, Category, executeApiQuery, WhitePlus, ShowAlert, convertToCSharpCompatibleFormat, isObjectEmpty} from '../services/Helpers';
// import {Category} from '../components/formComponents/EditFormCategory';

import {  FORM_STATUS_OBJ } from '../Constants';
import { GlobalContext, farms } from '../contexts/GlobalContext';

// import { saveForm } from '../services/AsyncStorage';


// ToDo: Consider adding render animation to make transitions more seamless
const EditForm_Refactored = ({ route, navigation }) => {
    const { formSchema:formFields } = useContext(GlobalContext);
    const { token } = useAuth().authData;
    const [loading, setloading] = useState(false);
    const retrievedForm = route.params.formSelected;
    const { Status:formStatus } = retrievedForm;
    const {Farm, House} = route.params.farmSelected;

    const form = useForm({mode: "onChange",});
    const { formState } = form;
   
    let header={};
    let categories={};
 
    const getFormFields = () => {
    //   let header={};
      Object.keys(retrievedForm).map((field, indx) => {
        if(typeof retrievedForm[field] != "object"){
          header = {...header, ...{[field] : retrievedForm[field]}};
        }else{
         categories = {...categories, [field]:retrievedForm[field]}
        }
      })
    //   return header;
    //  return ({...header, ...categories})
    }

    const onSubmit = data => {
      setloading(true);
      const adjustedForm ={...baseFormDetails, ...data,'Date Submitted':convertToCSharpCompatibleFormat(new Date())}

      if(adjustedForm.Status != FORM_STATUS_OBJ[0] || adjustedForm.Status != FORM_STATUS_OBJ[1]){
        // Farm.type?.toLowerCase() === "grow" ? adjustedForm.Status = FORM_STATUS_OBJ[1]: adjustedForm.Status = FORM_STATUS_OBJ[0];
        // adjustedForm.Status = setFormStatus(Farm);
  
        // ===========================================
        adjustedForm.Status = setFormStatus(Farm);
        // ===========================================

        // console.log("On Submit: ");
        // console.log(JSON.stringify(adjustedForm));
        // console.log("Get Fields: ");
        // console.log(JSON.stringify(getFormFields()));
        // saveForm(adjustedForm).then((updatedForm)=>{console.log(updatedForm)}).then(()=>setloading(false));
        saveForm(adjustedForm).then((updatedForm)=>{
          SubmitForm(updatedForm)
        });
      }else{
        // ===========================================
        adjustedForm.Status = setFormStatus(Farm);
        // ===========================================
        SubmitForm(adjustedForm)
      }
    };

    const SubmitForm = async (form) => {
      console.log("============================ Execute Query ==========================");
      // form.Status = setFormStatus(Farm);
      // console.log(JSON.stringify(form));
      executeApiQuery('/api/FormDetails/submitFormDetails',token,'post',JSON.stringify(form),undefined)
      // executeApiQuery('/api/FormDetails/submitFormDetails',token,'post',undefined,{_object:JSON.stringify(form)})
      .then((response) => {
        if(response.status == 200 ) {
          // console.log('======================== SUCCESS RESPONSE ============================');
          // console.log(response.data);
          Alert.alert(
            `Success`, 
            `Your form has been successfully SUBMITTED`,
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {text: "OK", onPress: () => navigation.goBack() }
            ]
          )
        }else{
          console.log("============================ Failed ==========================");
          console.warn(response.response.data);
          // console.log(form);
          const isSubmitted = response?.response?.data?.message === "Error -> A record was already created for that Flock and Date. Please check your information and try again" || response?.response?.data?.message === "Error -> That Form ID was already submitted. Please check your details and try again";
          let adjustedForm ={...form}
          if (!isSubmitted){
            adjustedForm = {...form, 'Date Submitted':" - ", Status:FORM_STATUS_OBJ[-1]};
            saveForm(adjustedForm);
          }else{
            adjustedForm.Status = FORM_STATUS_OBJ[0];
          }
          // saveForm(adjustedForm);
          ShowAlert(`Failed`, `${response?.response?.data?.message? response.response.data.message:response || "NO Error Code Found"}`);
        }
        setloading(false);
      });
    } 

    const onSave = (data) => {
      const adjustedForm = {...baseFormDetails, ...data}
      adjustedForm.Status = FORM_STATUS_OBJ[-1];
      console.log("On Save: ");
      console.log(adjustedForm);
      saveForm(adjustedForm).then(() => {
       Alert.alert(
          `Success`, 
          `Your form has been successfully SAVED`,
          [
           {
             text: "Cancel",
             onPress: () => console.log("Cancel Pressed"),
             style: "cancel"
           },
           { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
       );
       setloading(false)});
    }

    const saveForm = async (form) => {
      let found=false;
      let updatedForm={};
      const arrForm = [form];
      // console.log(form);
      const storedForms = await AsyncStorage.getItem('@forms');
      let storedFormsParsed = JSON.parse(storedForms);
      
      if (storedForms !== null) {
        storedFormsParsed.map(async (asyncForm, formIndex) => {
          if(storedFormsParsed[formIndex]['Form Id']==form['Form Id']){
            storedFormsParsed[formIndex] = {...storedFormsParsed[formIndex], ...form};
            updatedForm = storedFormsParsed[formIndex];
            found=true;
            try{
              // console.log("String ======== ");
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
          return arrForm[0];
        }
  
      } else {
        try {
          await AsyncStorage.setItem('@forms', JSON.stringify(arrForm));
          return arrForm[0];
        } catch (error) {
          //errorrr
        }
      }
      return updatedForm;
    };

    getFormFields();  
    const baseFormDetails = header;  
    let canSubmit = isObjectEmpty(formState.errors);

    return(
        <ScrollView style={{backgroundColor:'#E0E8FC'}}>
          <Text style={styles.header}>EDIT FORM</Text>
          <FarmSummary props={{Farm, House}}/>

          <RenderForm formFields={formFields} retrievedForm={categories} form={form} farm={Farm} house={House.house}/>

          {
           !loading ? 
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
              {formStatus != FORM_STATUS_OBJ[0] && <TouchableOpacity style={!formState.isDirty? styles.saveButtonDisabled : !formState.isValid ? styles.button: styles.saveButtonDisabled} disabled={formState.isValid || !formState.isDirty} onPress={(e)=>{setloading(true); onSave(form.getValues());}}>
                  <Text style={!formState.isDirty ?  {color:"grey"} : !formState.isValid ? styles.buttonText: {color:"grey"}}>SAVE</Text>
              </TouchableOpacity>}
              {/* {(formState.errors) && console.log(isObjectEmpty(formState.errors))} */}
              <TouchableOpacity style={formState.isValid && canSubmit ? styles.button: styles.saveButtonDisabled} disabled={!formState.isValid || !canSubmit} onPress={(e)=>form.handleSubmit(onSubmit)(e)}>
                <Text style={formState.isValid && canSubmit ? styles.buttonText: {color:"grey"}}>{formStatus != FORM_STATUS_OBJ[0] ? "SAVE & SUBMIT" : "SUBMIT"}</Text>
              </TouchableOpacity> 
            </View>
           : <ActivityIndicator style={{marginVertical:40}} size="large" color="#282C50" />
          }
        </ScrollView>

    );
}

export default EditForm_Refactored;

export const setFormStatus = ({type, name}) => {
  if(type?.toLowerCase() === "grow")
    if(name?.toLowerCase().includes("grow 11"))
      return FORM_STATUS_OBJ[0];
    else
      return FORM_STATUS_OBJ[1];
  else
    return FORM_STATUS_OBJ[0];
} 

const RenderForm = ({ formFields, retrievedForm, form, farm, house }) => {
  return(
    <View>
      {
        Object.keys(formFields).map((key, index)=>{
          return(
            <CategoryController categorySchema={formFields[key]} retrievedData={retrievedForm[formFields[key].title]} form={form} key={index} farm={{...farm, ...{house:house}}}/>
          )
        })
      }
    </View>
  )
}

export const CategoryController = ({ categorySchema, retrievedData, form, farm }) => {  
    const shouldDisplay=()=>{
      return ( categorySchema.type.toLowerCase() === farm.type.toLowerCase()) || (categorySchema.type.toLowerCase() === "common");
    }
    const [collapsed, setCollapsed] = useState(()=>shouldDisplay());
    const DISABLED = !shouldDisplay();
    const data = useRef({retrievedData});

    return (
        <View>
            {/* {!DISABLED && <TouchableOpacity disabled={DISABLED} onPress={() => {data.current={retrievedData:form.getValues(categorySchema.title)}; setCollapsed(!collapsed); }}> */}
            { <TouchableOpacity disabled={DISABLED} onPress={() => {data.current={retrievedData:form.getValues(categorySchema.title)}; setCollapsed(!collapsed); }}>
              <View 
                style={collapsed? 
                    {
                      justifyContent:'center',
                      paddingVertical: 20,
                      paddingTop: 30,
                    }:{
                      flexDirection:'row',
                      justifyContent:'space-between',
                      backgroundColor: '#282C50',
                      paddingVertical: 20,
                      paddingTop: 30,
                      paddingHorizontal:'5%'
                    }}>
                <Text
                  style={collapsed? 
                    {
                    color: '#282C50',
                    fontSize: 26,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    // paddingVertical: 20,
                    // paddingTop: 30,
                  }:{
                    // backgroundColor: '#282C50',
                    color:'white',
                    fontSize: 26,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    // marginLeft:'5%',
                    // paddingVertical: 20,
                    // paddingTop: 30,
                  }}>
                  {categorySchema.title.toUpperCase()} 
                </Text>
                {!collapsed && <WhitePlus size={32} />}
              </View>
            </TouchableOpacity>}
            {collapsed && <Category categorySchema={categorySchema} retrievedData={data.current.retrievedData} form={form} farm={farm} />}
            {/* {visible && <Category categorySchema={categorySchema} retrievedData={data.current.retrievedData} form={form}/>} */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      marginHorizontal: 20,
    },
    header:{
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
      alignSelf:'center',
      marginTop:30,
      marginBottom:50,
    },
    buttonText:{
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
      textAlignVertical:'top',
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
      marginHorizontal:10,
      marginTop:30,
      marginBottom:50,
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
      marginHorizontal:10,
      marginTop:30,
      marginBottom:50,
    },
});