// NB: Using the form schema to populate form instead of retrieved for data as to keep hidden fields hidden from the user. This also helps with achieving consistency across the application.
import React, {useEffect, useState, useRef, useMemo, useContext} from 'react';
import {useForm, Controller, reset, FormContext, useFormContext} from 'react-hook-form';
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
import { ActivityIndicator, RadioButton } from 'react-native-paper';
// import DateTimePicker from '@react-native-community/datetimepicker';
import {FarmSummary, Category, executeApiQuery, timeConvert, timeConverter, WhitePlus, ShowAlert} from '../services/Helpers';
// import {Category} from '../components/formComponents/EditFormCategory';
import axios from 'axios';
import { APP_API, FORM_STATUS_OBJ } from '../Constants';
import { GlobalContext, farms } from '../contexts/GlobalContext';
import { getFarmFromAsync } from '../services/AsyncStorage';
// import { saveForm } from '../services/AsyncStorage';


// ToDo: Consider adding render animation to make transitions more seamless
const EditForm_Refactored = ({ route, navigation }) => {
    const { formSchema:formFields } = useContext(GlobalContext);
    const { token } = useAuth().authData;
    const [loading, setloading] = useState(false);
    const [canSubmit, setEnableSubmit] = useState(false);
    const retrievedForm = route.params.formSelected;
    const { Status:formStatus } = retrievedForm;
    const {Farm, House} = route.params.farmSelected;
    // let rejectReasons = route.params.reasons;
    // const reasons = JSON.parse(rejectReasons)
    const form = useForm({mode: "onChange",});
    const { formState } = form;
    // console.log(retrievedForm);
    // const FarmSummary = () => {
    //     return (
    //       <View
    //         style={{
    //           // backgroundColor: '#b892ff',
    //           backgroundColor: 'gold',
    //           // backgroundColor: '#ffc2e2',
    //           padding: 15,
    //           marginBottom: 30,
    //           elevation:3
    //         }}>
    //         <View
    //           style={{
    //             flexDirection: 'row',
    //             justifyContent: 'space-around',
    //             alignItems: 'center',
    //           }}>
    //           <View
    //             style={{
    //               alignItems: 'center',
    //               flexDirection: 'row',
    //             }}>
    //             <Text style={{fontSize: 18}}>Farm Type:</Text>
    //             <Text
    //               style={{
    //                 fontWeight: 'bold',
    //                 color: 'black',
    //                 marginLeft: 5,
    //                 fontSize: 18,
    //               }}>
    //               {Farm.type}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               alignItems: 'center',
    //               flexDirection: 'row',
    //             }}>
    //             <Text style={{fontSize: 18}}>Farm Name: </Text>
    //             <Text
    //               style={{
    //                 fontWeight: 'bold',
    //                 color: 'black',
    //                 marginLeft: 5,
    //                 fontSize: 18,
    //               }}>
    //               {Farm.name}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               alignItems: 'center',
    //               flexDirection: 'row',
    //             }}>
    //             <Text style={{fontSize: 18}}>House Selected: </Text>
    //             <Text
    //               style={{
    //                 fontWeight: 'bold',
    //                 color: 'black',
    //                 marginLeft: 5,
    //                 fontSize: 18,
    //               }}>
    //               {House.name}
    //             </Text>
    //           </View>
    //         </View>
    //         <View
    //           style={{
    //             flexDirection: 'row',
    //             justifyContent: 'space-around',
    //             alignItems: 'center',
    //             paddingTop:10
    //           }}>
    //           <View
    //             style={{
    //               alignItems: 'center',
    //               flexDirection: 'row',
    //             }}>
    //             <Text style={{fontSize: 18}}>Flock Number:</Text>
    //             <Text
    //               style={{
    //                 fontWeight: 'bold',
    //                 color: 'black',
    //                 marginLeft: 5,
    //                 fontSize: 18,
    //               }}>
    //               {House.flockNumber}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               alignItems: 'center',
    //               flexDirection: 'row',
    //             }}>
    //             <Text style={{fontSize: 18}}>Age: </Text>
    //             <Text
    //               style={{
    //                 fontWeight: 'bold',
    //                 color: 'black',
    //                 marginLeft: 5,
    //                 fontSize: 18,
    //               }}>
    //               {House.flockAge} Weeks
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               alignItems: 'center',
    //               flexDirection: 'row',
    //             }}>
    //             <Text style={{fontSize: 18}}>Flock Breed: </Text>
    //             <Text
    //               style={{
    //                 fontWeight: 'bold',
    //                 color: 'black',
    //                 marginLeft: 5,
    //                 fontSize: 18,
    //               }}>
    //               {House.flockBreed}
    //             </Text>
    
    //           </View>
    //           <View
    //             style={{
    //               alignItems: 'center',
    //               flexDirection: 'row',
    //             }}>
    //             <Text style={{fontSize: 18}}>Flock Housed: </Text>
    //             <Text
    //               style={{
    //                 fontWeight: 'bold',
    //                 color: 'black',
    //                 marginLeft: 5,
    //                 fontSize: 18,
    //               }}>
    //               {House.flockHoused}
    //             </Text>
    //           </View>
    //         </View>
    //       </View>
    //     );
    // };

    
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

    // console.log(setFormStatus(Farm));
    const onSubmit = data => {
      setloading(true);
      const adjustedForm ={...baseFormDetails, ...data,'Date Submitted':new Date().toJSON()}
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
      // console.log("============================ Execute Query ==========================");
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
          // console.log("============================ Failed ==========================");
          console.log(form);
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
      // console.log(data);
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

    // useEffect(()=>{
    //   console.log('FormState: '+JSON.stringify(formState));
    //   console.log('Form Validity: '+formState.isValid);
    //   console.log('Form Errors: '+JSON.stringify(formState.errors));
    //   console.log('Form isDirty: '+JSON.stringify(formState.isDirty));
    // },[formState])

    getFormFields();  
    const baseFormDetails = header;  
    // const baseFormDetails = getFormFields();  
    // console.log(Object.keys({}).map((key,idx)=>key))
    // console.log(retrievedForm)
    // console.log(formStatus);
    return(
        // <FormContext {...methods}>
        <ScrollView style={{backgroundColor:'#E0E8FC'}}>
          <Text style={styles.header}>EDIT FORM</Text>
          <FarmSummary props={{Farm, House}}/>
          {/* <View style={{marginHorizontal:"10%", backgroundColor:"white", borderWidth:2, borderRadius:10, borderColor:'#81171b', paddingBottom:10}}>
            <Text style={{backgroundColor:'#81171b', color:'white', fontSize:20, fontWeight:'bold', paddingHorizontal:10, borderTopRightRadius:5, borderTopLeftRadius:5, elevation:1}}>Rejection Reasons</Text>
            <Text style={{color:"#5e0b15", fontSize:16, marginHorizontal:10}}>This form was rejected for the following reason(s):</Text>
            {reasons.map((reason, idx)=>{
              return <Text key={idx} style={{padding:5, marginLeft:30, marginRight:10,fontSize:16, backgroundColor: (idx%2!=0)? 'white' : '#f8f9fa'}}><Text style={{marginHorizontal:10, color:"#5e0b15", fontSize:16}}>{idx+1}.       </Text>{reasons[idx]}</Text>
            })}
          </View> */}
          {/* {console.log(form.formState.isValid)} */}
          {/* <RenderForm formFields={formFields} retrievedForm={retrievedForm} form={form} /> */}
          <RenderForm formFields={formFields} retrievedForm={categories} form={form} farm={Farm} house={House.house}/>
          {/* Change the below VIEW component to a Category control function which toggles visibilty and saves the values accordingly */}
          {/* <CategoryController categorySchema={formFields[2]} retrievedData={retrievedForm["Miscellaneous"]} form={form}/>
          <CategoryController categorySchema={formFields[4]} retrievedData={retrievedForm["Vaccination"]} form={form}/> */}
          {/* <Button disabled={!formState.isValid} title="Submit" onPress={(e)=>form.handleSubmit(onSubmit)(e)} />
          <Button title="Save" onPress={() => console.log(form.getValues())} /> */}
          {
           !loading ? 
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
              {formStatus != FORM_STATUS_OBJ[0] && <TouchableOpacity style={!formState.isDirty? styles.saveButtonDisabled : !formState.isValid ? styles.button: styles.saveButtonDisabled} disabled={formState.isValid || !formState.isDirty} onPress={(e)=>{setloading(true); onSave(form.getValues());}}>
                  <Text style={!formState.isDirty ?  {color:"grey"} : !formState.isValid ? styles.buttonText: {color:"grey"}}>SAVE</Text>
              </TouchableOpacity>}
              {/* <TouchableOpacity style={!formState.isValid ? styles.button: styles.saveButtonDisabled} onPress={(e)=>getFormFields}>
                  <Text style={!formState.isValid ? styles.buttonText: {color:"grey"}}>Get Values</Text>
              </TouchableOpacity> */}
              {/* {console.log("IS THE FORM VALID? "+formState.isValid)}
              {console.log("IS THE FORM VALID? "+JSON.stringify(formState.errors))} */}
              <TouchableOpacity style={formState.isValid ? styles.button: styles.saveButtonDisabled} disabled={!formState.isValid} onPress={(e)=>form.handleSubmit(onSubmit)(e)}>
                <Text style={formState.isValid ? styles.buttonText: {color:"grey"}}>{formStatus != FORM_STATUS_OBJ[0] ? "SAVE & SUBMIT" : "SUBMIT"}</Text>
              </TouchableOpacity> 
            </View>
           : <ActivityIndicator style={{marginVertical:40}} size="large" color="#282C50" />
          }
        </ScrollView>
        // </FormContext>
    );
}

export default EditForm_Refactored;

export const setFormStatus = ({type, name}) => {
  // console.log("=============== "+type.toLowerCase(), name.toLowerCase());
  if(type?.toLowerCase() === "grow")
    if(name?.toLowerCase().includes("grow 11"))
      return FORM_STATUS_OBJ[0];
    else
      return FORM_STATUS_OBJ[1];
  else
    return FORM_STATUS_OBJ[0];
} 
//Mock Form MetaData
// const formFields = [
//     {
//       title: 'Culls & Mortality',
//       type: 'common',
//       fields: [
//         {label: 'Culls - Male', type: 'int', fieldName:"", placeholder:""},
//         {label: 'Mortality - Male', type: 'int'},
//         {label: 'Culls - Female', type: 'int', fieldName:"", placeholder:""},
//         {label: 'Mortality - Female', type: 'int'},
//         {label: 'Dead on Arrival', type: 'int'},
//       ],
//     },
//     {
//       title: 'Feed Inventory',
//       type: 'common',
//       fields: [
//         //Feed Inventory
//         {label: 'Feed Brought Forward (lbs)', type: 'float'},
//         {label: 'Feed Recieved (lbs)', type: 'float'},
//         {label: 'Feed Transferred (lbs)', type: 'float'},
//         {label: 'Feed Spoilage (lbs)', type: 'float'},
//         {label: 'Days in Inventory', type: 'float'},
//         //Feed Consumed
//         {label: 'Feed Time', type: 'time'},
//         {label: 'Feed Consumption Time', type: 'justTime'},
//         {label: 'Feed Consumed (lbs) -  Male', type: 'float'},   //Conditional fields based on gender
//         {label: 'Feed Consumed (lbs) -  Female', type: 'float'}, //Conditional fields based on gender
//         {label: 'Feed Distribution  - Male', type: 'option', options:['GOOD','POOR']},
//       ],
//     },
//     {
//       title: 'Miscellaneous',
//       type: 'common',
//       fields: [
//         {label: 'Water Consumption', type: 'float'},
//         {label: 'Bird Weight - Male', type: 'float'},
//         {label: 'Bird Weight - Female', type: 'float'},
//         {label: 'Uniformity - Male', type: 'float'},
//         {label: 'Uniformity - Female', type: 'float'},
//         {label: 'All Clocks on Time', type: 'option', options:['YES','NO']},
//         {label: 'Lights', type: 'option', options:['ON','OFF']},
//         {label: 'Lighting Hours', type: 'float'},
//         {
//             label: 'Temperature Min', 
//             type: 'time',
//             fields: [
//               {label: 'Min 1st Entry', type: 'float', view:'value-time'},
//               {label: 'Min 2nd Entry', type: 'float', view:'value-time'}
//             ]
//         },
//         {
//           label: 'Temperature Max', 
//           type: 'time',
//           fields: [
//             {label: 'Max 1st Entry', type: 'float', view:'value-time'},
//             {label: 'Max 2nd Entry', type: 'float', view:'value-time'}
//           ]
//         },
//         {label: 'Observation/Comments', type: 'description'},
//       ],
//     },
//     {
//       title: 'Eggs',
//       type: 'production',
//       fields: [
//         {
//           label: 'Hatching Eggs', 
//           type: 'multi-field', 
//           fields: [
//             {label: 'Hatching 1st Entry', type: 'int'},
//             {label: 'Hatching 2nd Entry', type: 'int'},
//             {label: 'Hatching 3rd Entry', type: 'int'},
//             {label: 'Hatching 4th Entry', type: 'int'},
//           ],
//         },
//         {label: 'Reject Eggs', type: 'multi-field', fields: [
//           {label: 'Rejects 1st Entry', type: 'int'},
//           {label: 'Rejects 2nd Entry', type: 'int'},
//           {label: 'Rejects 3rd Entry', type: 'int'},
//           {label: 'Rejects 4th Entry', type: 'int'},
//         ],
//         },
//         {label: 'Dumps', type: 'multi-field', fields: [
//           {label: 'Dumps 1st Entry', type: 'int'},
//           {label: 'Dumps 2nd Entry', type: 'int'},
//           {label: 'Dumps 3rd Entry', type: 'int'},
//           {label: 'Dumps 4th Entry', type: 'int'},
//         ],},
//         {label: 'Double Yolked Eggs', type: 'multi-field', fields: [
//           {label: 'Double Yolked 1st Entry', type: 'int'},
//           {label: 'Double Yolked 2nd Entry', type: 'int'},
//           {label: 'Double Yolked 3rd Entry', type: 'int'},
//           {label: 'Double Yolked 4th Entry', type: 'int'},
//         ],},
//         {label: 'Eggs Delivered', type: 'int'},
//         {label: 'Net Egg Weight', type: 'float'},
//         {label: 'Average Egg Weight', type: 'float'},
//         {label: 'Egg Room Temp (Wet)',
//             type: 'time',
//             fields: [
//               {label: 'Egg Wet 1st Entry', type: 'float', view:'value-time'},
//               {label: 'Egg Wet 2nd Entry', type: 'float', view:'value-time'}
//           ]
//         },
//         {label: 'Egg Room Temp (Dry)',
//         type: 'time',
//         fields: [
//           {label: 'Egg Dry 1st Entry', type: 'float', view:'value-time'},
//           {label: 'Egg Dry 2nd Entry', type: 'float', view:'value-time'}
//       ]},
//         {label: 'Egg Room Humidity (%)', type: 'float'},
//       ],
//     },
//     {
//       title: 'Vaccination',
//       type: 'pullet',
//       fields: [
//         {label: 'Type/Description', type: 'string'},
//         {label: 'Quantity', type: 'float'},
//         {label: 'Serial Number', type: 'string'},
//       ],
//     },
// ];

const RenderForm = ({ formFields, retrievedForm, form, farm, house }) => {
  // console.log(farm, house);
    return(
      <View>
        {
          Object.keys(formFields).map((key, index)=>{
            return(
              <CategoryController categorySchema={formFields[key]} retrievedData={retrievedForm[formFields[key].title]} form={form} key={index} farm={{...farm, ...{house:house}}}/>
            )
            //   console.log(formFields[key].title, retrievedForm[formFields[key].title])
          })
        }
      </View>
    )
}

export const CategoryController = ({ categorySchema, retrievedData, form, farm }) => {  
    // console.log(farm);
    // consider implementing a load animation
    const shouldDisplay=()=>{
      // console.log(categorySchema.title?.toLowerCase(), categorySchema.type.toLowerCase(), farm.type?.toLowerCase());
      return ( categorySchema.type.toLowerCase() === farm.type.toLowerCase()) || (categorySchema.type.toLowerCase() === "common");
    }
    const [collapsed, setCollapsed] = useState(()=>shouldDisplay());
    const DISABLED = !shouldDisplay();
    // const [visible, setVisibility] = useState(true);
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

// const Category = ({ categorySchema, retrievedData, form }) => {
//     // ToDo: Time fields need to be fixed- currently not saving state change or rerender
//     const {
//         register,
//         control,
//         handleSubmit,
//         formState: {errors, isValid},
//         reset,
//         getValues,
//         setValue
//       } = form;
//     // console.log(categorySchema, retrievedData);
//     if (typeof retrievedData == "undefined"){
//       retrievedData={};
//     }
    
//     // console.log("retrieved data:   ", retrievedData);
//     return(    
//         <ScrollView>
//             <View style={styles.container}>
//                 {categorySchema.fields.map((item, index) => {
//                     // Checking the retrieved data for a value matching this object key
//                     let defaultVal="";
//                     let baseFormLabel=categorySchema.title + "." +item.label;
//                     // console.log(retrievedData);
//                     Object.keys(retrievedData).map((field, fieldIndex) => {
//                       if(item.label==field && retrievedData[field] != ""){
//                         defaultVal=retrievedData[field];
//                       }
//                     });
              
//                     //Nested Fields Conditional Function
//                     if (typeof item.fields !== 'undefined') { // Check for fields array
//                       //Since there in a fields array, further checks must be made to determine what type of field group is to be populated
//                       //Nested Calculated (Tally Total) Fields Function
//                       if (item.type == 'multi-field') { //Refector this section to run in a loop and accept more fields
//                           const [val1,setVal1] =useState(typeof defaultVal[item.fields[0].label] == "undefined" ? 0 : defaultVal[item.fields[0].label]);
//                           const [date1, setDate1]= useState(typeof defaultVal[`${item.fields[0].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[0].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[0].label} Time Captured`]));
//                           const [isVisible1, setIsVisible1]= useState(false);
                    
//                           const [val2,setVal2] =useState(typeof defaultVal[item.fields[1].label] == "undefined" ? 0 : defaultVal[item.fields[1].label]);
//                           const [date2, setDate2]= useState(typeof defaultVal[`${item.fields[1].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[1].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[1].label} Time Captured`]));
//                           const [isVisible2, setIsVisible2]= useState(false);
                    
//                           const [val3,setVal3] =useState(typeof defaultVal[item.fields[2].label] == "undefined" ? 0 : defaultVal[item.fields[2].label]);
//                           const [date3, setDate3]=useState(typeof defaultVal[`${item.fields[2].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[2].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[2].label} Time Captured`]));
//                           const [isVisible3, setIsVisible3]= useState(false);
                    
//                           const [val4,setVal4] =useState(typeof defaultVal[item.fields[3].label] == "undefined" ? 0 : defaultVal[item.fields[3].label]);
//                           const [date4, setDate4]= useState(typeof defaultVal[`${item.fields[3].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[3].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[3].label} Time Captured`]));
//                           const [isVisible4, setIsVisible4]= useState(false);
                    
//                           // console.log(defaultVal[item.fields[3].label])
                    
//                           const [total,setTotal] =useState(val1+val2+val3+val4);

//                           useEffect(()=>{setTotal(Number(val1)+Number(val2)+Number(val3)+Number(val4));})
//                           useEffect(()=>{setValue(baseFormLabel+"."+item.label+" Total",total);},[total])
                    
//                           return (
//                             <View style={{marginVertical: 12}} key={index}>
//                        <Text style={{color: '#282C50', fontSize: 18}}>
//                          {item.label}
//                        </Text>
//                        <View
//                          style={{
//                            height:100,
//                            flexDirection: 'row',
//                            justifyContent: 'space-between',
//                            alignItems: 'center',
//                          }}>
//                            {/* Entry 1 */}
//                            <View>  
//                            {/* ERROR BORDER COLOR  */}
//                            {/* <View style={{flexDirection:'column', height:'100%', alignContent:'flex-start', alignSelf:'flex-start'}}>  */}
//                              <Controller        
//                                 control={control}   
//                                 defaultValue={defaultVal[item.fields[0].label]}  
//                                 name={baseFormLabel +"."+item.fields[0].label} 
//                                 rules={(()=>rules(item.fields[0].type))()}        
//                                 render={({field: {onChange, value1, onBlur}}) => (            
//                                   <TextInput                    
//                                     style={styles.input}
//                                     placeholder="Enter 1st Entry"            
//                                     value={value1} 
//                                     defaultValue={defaultVal[item.fields[0].label]? ""+defaultVal[item.fields[0].label]:""}          
//                                     onBlur={onBlur}          
//                                     keyboardType="number-pad"  
//                                     onChangeText={value => {
//                                      onChange(value); 
//                                      setValue(`${baseFormLabel}.${item.fields[0].label} Time Captured`, date1.toJSON());
//                                      setValue(`${baseFormLabel}.${item.fields[0].label}`, Number(value));
//                                      setVal1(Number(value));
//                                      setDate1(new Date());
//                                      defaultVal[`${item.fields[0].label} Time Captured`]=new Date().toJSON();
//                                    }}          
//                                   />        
//                                 )} 
//                              />
//                              { 
//                             //  console.log(`rerendered`)
//                              }
//                              {
//                                (()=>{
//                                  let err, r;
//                                  err = errors[`${item.label}`]
//                                  err? r = Object.keys(err)[0]:"";
//                                  // err? console.log(err[r]):"";
//                                  err? console.log(errors[item.label][item.fields[0].label]):"";
//                                })()
//                              }
//                              {/* {console.log(errors[`${item.label}`])} */}
//                              {/* {console.log(item.fields[0].label+"   : " + date1)} */}
 
 
//                              <Controller
//                                  control={control}
//                                  name={baseFormLabel + "." + item.fields[0].label + " Time Captured"}
//                                  defaultValue={date1}
//                                  value={date1}
//                                  render={({ field }) => (
//                                  <TouchableOpacity onPress={()=>setIsVisible1(true)}  style={{padding:5, backgroundColor:'beige'}}>
//                                      <Text style={{color:'black'}}>Time: {timeConvert(date1.toLocaleTimeString('en-US', { hour12: true }))}</Text>
//                                      {
//                                        isVisible1 && 
//                                        <DateTimePicker 
//                                          value={date1} 
//                                          defaultValue={date1} 
//                                          is24Hour={false} 
//                                          onChange={(event, selectedDate)=>{
//                                            setIsVisible1(false);
//                                            setDate1(selectedDate);
//                                            setValue(`${baseFormLabel}.${item.fields[0].label} Time Captured`, date1.toJSON())
//                                            defaultVal[`${item.fields[0].label} Time Captured`]=selectedDate;
//                                            }
//                                          } 
//                                          mode="time" display="spinner" 
//                                        />
//                                      }
//                                  </TouchableOpacity>
//                                  )}
//                              />  
//                              { 
//                                errors && errors[item.label] && errors[item.label][item.fields[0].label] && (
//                                  errors[item.label][item.fields[0].label].type != 'required' && 
//                                  (<Text style={{ color: "red" }}>
//                                    {errors[item.label][item.fields[0].label].type} ERORR
//                                  </Text>)
//                                )
//                              }
//                            </View>
//                            {/* Entry 2 */}
//                            <View>
//                              <Controller        
//                                 control={control}  
//                                 defaultValue={defaultVal[item.fields[1].label]}        
//                                 name={baseFormLabel+"."+item.fields[1].label}  
//                                 rules={(()=>rules(item.fields[1].type))()}      
//                                 render={({field: {onChange, value2, onBlur}}) => (            
//                                   <TextInput                    
//                                     style={styles.input}
//                                     placeholder="Enter 2nd Entry" 
//                                     defaultValue={defaultVal[item.fields[1].label]? ""+defaultVal[item.fields[1].label]:""}             
//                                     value={value2}            
//                                     onBlur={onBlur}        
//                                     keyboardType="number-pad"    
//                                     onChangeText={value => {
//                                      onChange(value);
//                                      setValue(`${baseFormLabel}.${item.fields[1].label} Time Captured`, date2.toJSON());
//                                      setValue(`${baseFormLabel}.${item.fields[1].label}`, Number(value));
//                                      setVal2(Number(value));
//                                      setDate2(new Date());
//                                      defaultVal[`${item.fields[1].label} Time Captured`]=new Date().toJSON();
//                                    }}          
//                                   />        
//                                 )} 
//                              />
//                              <Controller
//                                control={control}
//                                name={baseFormLabel+"."+item.fields[1].label+ " Time Captured"}
//                                value={date2}
//                                defaultValue={date2} 
//                                render={({ field }) => (
//                                <TouchableOpacity onPress={()=>setIsVisible2(true)}  style={{padding:5, backgroundColor:'beige'}}>
//                                    <Text style={{color:'black'}}>Time: {timeConvert(date2.toLocaleTimeString('en-US', { hour12: true }))}</Text>
//                                    {
//                                      isVisible2 && 
//                                      <DateTimePicker 
//                                        value={date2} 
//                                        defaultValue={date2} 
//                                        is24Hour={false} 
//                                        onChange={(event, selectedDate)=>{
//                                            setIsVisible2(false);
//                                            setDate2(selectedDate);
//                                            setValue(`${baseFormLabel}.${item.fields[1].label} Time Captured`, date2.toJSON())
//                                            defaultVal[`${item.fields[1].label} Time Captured`]=selectedDate;
//                                          }
//                                        } 
//                                        mode="time" display="spinner" 
//                                      />
//                                    }
//                                </TouchableOpacity>
//                                  )}
//                              />
//                              {
//                                (()=>{
//                                  let err, r;
//                                  err = errors[`${item.label}`]
//                                  err? r = Object.keys(err)[0]:"";
//                                  // err? console.log(err[r]):"";
//                                  err? console.log(errors[item.label][item.fields[1].label]):"";
 
//                                })()
//                              }
//                              { 
//                                errors && errors[item.label] && errors[item.label][item.fields[1].label] && (
//                                  errors[item.label][item.fields[1].label].type != 'required' && ( <Text style={{ color: "red" }}>
//                                    {errors[item.label][item.fields[1].label].type} ERORR
//                                  </Text>)
//                                )
//                              }
//                            </View>
//                            {/* Entry 3 */}
//                            <View>
//                              <Controller        
//                                 control={control}  
//                                 defaultValue={defaultVal[item.fields[2].label]}         
//                                 name={baseFormLabel+"."+item.fields[2].label}   
//                                 rules={(()=>rules(item.fields[2].type))()}     
//                                 render={({field: {onChange, value3, onBlur}}) => (            
//                                   <TextInput 
//                                     style={styles.input}                   
//                                     placeholder="Enter 3rd Entry" 
//                                     defaultValue={defaultVal[item.fields[2].label]? ""+defaultVal[item.fields[2].label]:""}             
//                                     value={value3}            
//                                     onBlur={onBlur}  
//                                     keyboardType="number-pad"          
//                                     onChangeText={value => {
//                                      onChange(value);
//                                      setValue(`${baseFormLabel}.${item.fields[2].label} Time Captured`, date3.toJSON());
//                                      setValue(`${baseFormLabel}.${item.fields[2].label}`, Number(value));
//                                      setVal3(Number(value));
//                                      setDate3(new Date());
//                                      defaultVal[`${item.fields[2].label} Time Captured`]=new Date().toJSON();
//                                    }}          
//                                   />        
//                                 )} 
//                              />
//                              <Controller
//                                control={control}
//                                name={baseFormLabel+"."+item.fields[2].label + " Time Captured"}
//                                defaultValue={date3}
//                                value={date3}
//                                render={({ field }) => (
//                                <TouchableOpacity onPress={()=>setIsVisible3(true)}  style={{padding:5, backgroundColor:'beige'}}>
//                                    <Text style={{color:'black'}}>Time: {timeConvert(date3.toLocaleTimeString('en-US', { hour12: true }))}</Text>
//                                    {
//                                      isVisible3 && 
//                                      <DateTimePicker 
//                                        value={date3} 
//                                        defaultValue={date3} 
//                                        is24Hour={false} 
//                                        onChange={(event, selectedDate)=>{
//                                             setIsVisible3(false);
//                                             setDate3(selectedDate);
//                                             setValue(`${baseFormLabel}.${item.fields[2].label} Time Captured`, date3.toJSON())
//                                             defaultVal[`${item.fields[2].label} Time Captured`]=selectedDate;
//                                          }
//                                        } 
//                                        mode="time" display="spinner" 
//                                      />
//                                    }
//                                </TouchableOpacity>
//                                  )}
//                              />
//                              {
//                                (()=>{
//                                  let err, r;
//                                  err = errors[`${item.label}`]
//                                  err? r= Object.keys(err)[0]:"";
//                                  // err? console.log(err[r]):"";
//                                  err? console.log(errors[item.label][item.fields[2].label]):"";
 
//                                })()
//                              }
//                              { 
//                                errors && errors[item.label] && errors[item.label][item.fields[2].label] && (
//                                  errors[item.label][item.fields[2].label].type != 'required' && (<Text style={{ color: "red" }}>
//                                    {errors[item.label][item.fields[2].label].type} ERORR
//                                  </Text>)
//                                )
//                              }
//                            </View>
//                            {/* Entry 4 */}
//                            <View>
//                              <Controller        
//                                 control={control} 
//                                 defaultValue={defaultVal[item.fields[3].label]}           
//                                 name={baseFormLabel+"."+item.fields[3].label}
//                                 rules={(()=>rules(item.fields[3].type))()}        
//                                 render={({field: {onChange, value4, onBlur}}) => (            
//                                   <TextInput      
//                                     style={styles.input}              
//                                     placeholder="Enter 4th Entry" 
//                                     defaultValue={defaultVal[item.fields[3].label]? ""+defaultVal[item.fields[3].label]:""}             
//                                     value={value4}            
//                                     onBlur={onBlur} 
//                                     keyboardType="number-pad"           
//                                     onChangeText={value => {
//                                      onChange(value);
//                                      setValue(`${baseFormLabel}.${item.fields[3].label} Time Captured`, date4.toJSON()); 
//                                      setValue(`${baseFormLabel}.${item.fields[3].label}`, Number(value)); 
//                                      setVal4(Number(value));
//                                      setDate4(new Date());
//                                      defaultVal[`${item.fields[3].label} Time Captured`]=new Date().toJSON();
//                                    }}          
//                              />   
//                                 )} 
//                              />
//                              <Controller
//                                control={control}
//                                name={baseFormLabel+"."+item.fields[3].label+" Time Captured"}
//                                defaultValue={date4} 
//                                value={date4}
//                                render={({ field }) => (
//                                <TouchableOpacity onPress={()=>setIsVisible4(true)}  style={{padding:5, backgroundColor:'beige'}}>
//                                    <Text style={{color:'black'}}>Time: {timeConvert(date4.toLocaleTimeString('en-US', { hour12: true }))}</Text>
//                                    {
//                                      isVisible4 && 
//                                      <DateTimePicker 
//                                        value={date4} 
//                                        defaultValue={date4} 
//                                        is24Hour={false} 
//                                        onChange={(event, selectedDate)=>{
//                                             setIsVisible4(false);
//                                             setDate4(selectedDate);
//                                             setValue(`${baseFormLabel}.${item.fields[3].label} Time Captured`, date4.toJSON())
//                                             defaultVal[`${item.fields[3].label} Time Captured`]=selectedDate;
//                                          }
//                                        } 
//                                        mode="time" display="spinner" 
//                                      />
//                                    }
//                                </TouchableOpacity>
//                                  )}
//                              />
//                              {
//                                (()=>{
//                                  let err, r;
//                                  err = errors[`${item.label}`]
//                                  err? r= Object.keys(err)[0]:"";
//                                  err? console.log(err[r]):"";
//                                  err? console.log(errors[item.label][item.fields[3].label]):"";
 
//                                })()
//                              }
//                              { 
//                                errors && errors[item.label] && errors[item.label][item.fields[3].label] && (
//                                  errors[item.label][item.fields[3].label].type != 'required' && (<Text style={{ color: "red" }}>
//                                    {errors[item.label][item.fields[3].label].type} ERORR
//                                  </Text>)
//                                )
//                              }
//                            </View>
 
//                            <Text style={{fontSize:18}}>= {total}</Text>
//                        </View>
//                           </View>
//                         );
//                       }else{
//                         //Nested Time Fields Function
//                         return(
//                           <View style={{marginVertical: 12}} key={index}>
//                             <Text style={{color: '#282C50', fontSize: 18}}>
//                               {item.label}
//                             </Text>
//                             <View
//                               style={{
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                               }}>
//                                   {item.fields.map((subItem, subIndex) => {
//                                     const [date, setDate] = useState(defaultVal[`${item.fields[subIndex].label} Time Captured`] == "" ? new Date() : isNaN(new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`])) ? new Date() : new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`]));
//                                     const [isVisible, setIsVisible] = useState(false);
//                                     return(
//                                       <View key={subIndex}>
//                                         <Controller
//                                           key={subIndex}
//                                           control={control}
//                                           defaultValue={defaultVal[subItem.label]}
//                                           name={baseFormLabel + '.' + subItem.label}
//                                           rules={(()=>rules(subItem.type))()}
//                                           render={({field: {onChange, onBlur, value}}) => (
//                                             <>
//                                               <TextInput
//                                                 style={styles.input}
//                                                 placeholder={subItem.label}
//                                                 defaultValue={defaultVal[subItem.label]? ""+defaultVal[subItem.label]:""}
//                                                 onBlur={onBlur}
//                                                 // onChangeText={(e) => {onChange(e); if(e != ""){setValue(`${baseFormLabel}.${subItem.label} Time Captured`, (new Date).toJSON()); setValue(`${baseFormLabel}.${subItem.label}`, parseFloat(e));}}}
//                                                 onChangeText={(e) => {onChange(e); if(e != ""){setValue(`${baseFormLabel}.${subItem.label} Time Captured`, (new Date).toJSON()); setValue(`${baseFormLabel}.${subItem.label}`, parseFloat(e));}else{defaultVal[subItem.label]=e}}}
//                                                 // onChangeText={(e) => {onChange(e); setValue(`${baseFormLabel}.${subItem.label} Time Captured`, (new Date).toJSON()); setValue(`${baseFormLabel}.${subItem.label}`, parseFloat(e));console.log(value);}}
//                                                 // onChangeText={(e) => {onChange(e);console.log(value);setValue(`${baseFormLabel}.${subItem.label} Time Captured`, (new Date).toJSON()); setValue(`${baseFormLabel}.${subItem.label}`, isNaN(parseFloat(e))?0:parseFloat(e));}}
//                                                 value={value}
//                                                 // value={isNaN(value)? " " : value}
//                                                 keyboardType={(subItem.type=='int' || subItem.type=='float') ? "number-pad":"default"}
//                                                 />
//                                             </>
//                                           )}
//                                           />
//                                           <Controller
//                                             control={control}
//                                             name={baseFormLabel + '.' +subItem.label+' Time Captured'}
//                                             value={date}
//                                             defaultValue={date}
//                                             render={({ field, register }) => (
//                                             <TouchableOpacity onPress={()=>setIsVisible(true)} style={{paddingVertical:10, paddingHorizontal:5, backgroundColor:'beige'}}>
//                                                 <Text style={{color:'black'}}>Time: {timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
//                                                 {
//                                                   isVisible && 
//                                                   <DateTimePicker 
//                                                     value={date} 
//                                                     is24Hour={false}
//                                                     defaultValue={defaultVal[subItem.label+" Time Captured"]}
//                                                     onChange={(event, selectedDate)=>{
//                                                       setIsVisible(false);
//                                                       setDate(selectedDate);
//                                                       setValue(`${baseFormLabel}.${subItem.label} Time Captured`, date.toJSON())
//                                                       }
//                                                     } 
//                                                     mode="time" display="spinner" 
//                                                   />
//                                                 }
//                                             </TouchableOpacity>
//                                               )}
//                                           />
//                                           { 
//                                             errors && errors[categorySchema.title] && errors[categorySchema.title] && errors[categorySchema.title][item.label] && errors[categorySchema.title][item.label][subItem.label] && (
//                                               ( errors[categorySchema.title][item.label][subItem.label].type != 'required') && <Text style={{ color: "red" }}>
//                                                  {errors[categorySchema.title][item.label][subItem.label].type} ERORR
//                                               </Text>
//                                             )
//                                           }
//                                       </View>
//                                     );
//                                 })}
//                             </View>
//                           </View>
//                         )
//                       }             
//                     } else {
//                       //Radio Button Field Function
//                       if(item.type == 'option'){
//                         return(
//                           <View style={{marginVertical: 12}} key={index}>
//                             <Text style={{color: '#282C50', fontSize: 18}}>
//                               {item.label}
//                             </Text>
//                             <Controller
//                               control={control}
//                               name={baseFormLabel}
//                               defaultValue={defaultVal}
//                               render={({field: {onChange, value}}) => (
//                                 <>
//                                   <RadioButton.Group
//                                     onValueChange={onChange}
//                                     value={value}
//                                     >
//                                     <View style={{flexDirection:'row', alignItems:'center'}}>
//                                       <RadioButton status={defaultVal == item.options[0]? "checked" : "unchecked"} value={item.options[0]}></RadioButton>
//                                       <Text style={{fontSize:16}}>{item.options[0]}</Text>
//                                     </View>
//                                     <View style={{flexDirection:'row', alignItems:'center'}}>
//                                       <RadioButton status={defaultVal == item.options[1]? "checked" : "unchecked"} value={item.options[1]}></RadioButton>
//                                       <Text style={{fontSize:16}}>{item.options[1]}</Text>
//                                     </View>
//                                   </RadioButton.Group>
//                                 </>
//                               )}
//                             />
//                           </View>
//                         )
//                       }else if(item.type == 'time'){
//                         const [date,setDate]=useState((defaultVal === "" || typeof defaultVal == "undefined" ? new Date() : new Date(defaultVal)));
//                         const [isVisible,setIsVisible]=useState(false);
//                         return(
//                           <View style={{marginVertical: 12}} key={index}>
//                             <Text style={{color: '#282C50', fontSize: 18}}>
//                               {item.label}
//                             </Text>
//                             <Controller
//                               control={control}
//                               name={baseFormLabel}
//                               value={date}
//                               render={({ field }) => (
//                               <TouchableOpacity onPress={()=>setIsVisible(true)}  style={{padding:10, backgroundColor:'beige'}}>
//                                   <Text style={{color:'black'}}>Time: {timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
//                                   {
//                                     isVisible && 
//                                     <DateTimePicker 
//                                       value={date} 
//                                       defaultValue={date} 
//                                       is24Hour={false} 
//                                       onChange={(event, selectedDate)=>{
//                                           setIsVisible(false);
//                                           setDate(selectedDate);
//                                           setValue(`${baseFormLabel}`, selectedDate.toJSON());
//                                           defaultVal=selectedDate;
//                                         }
//                                       } 
//                                       mode="time" display="spinner" 
//                                     />
//                                   }
//                               </TouchableOpacity>
//                               )}
//                             /> 
//                         </View>
//                       );
//                       }else if(item.type == 'justTime'){
//                         var d;
//                         if (defaultVal == "" || typeof defaultVal == 'undefined'){ d=new Date(); d.setHours(0,0,0,0); }
//                         else d=new Date(defaultVal);
//                         const [date,setDate]=useState(d);
//                         const [isVisible,setIsVisible]=useState(false);
//                         return(
//                           <View style={{marginVertical: 12}} key={index}>
//                             <Text style={{color: '#282C50', fontSize: 18}}>
//                               {item.label}
//                             </Text>
//                             <Controller
//                               control={control}
//                               name={baseFormLabel}
//                               defaultValue={date}
//                               value={date}
//                               render={({ field }) => (
//                               <TouchableOpacity onPress={()=>setIsVisible(true)}  style={{padding:10, backgroundColor:'beige'}}>
//                                   <Text style={{color:'black'}}>{timeConverter(date)}</Text>
//                                   {
//                                     isVisible && 
//                                     <DateTimePicker 
//                                       value={date} 
//                                       is24Hour={true} 
//                                       onChange={(selectedDate)=>{
//                                           setIsVisible(false);
//                                           setDate(selectedDate);
//                                           setValue(`${baseFormLabel}`, selectedDate.toJSON())
//                                         }
//                                       } 
//                                       mode="time" display="spinner" 
//                                     />
//                                   }
//                               </TouchableOpacity>
//                               )}
//                             /> 
//                           </View>
//                         );
//                       }else{ 
//                       //Typical Input Field Function  
//                       const defaultVal1=useRef(defaultVal);
//                     //   console.log(defaultVal1.current);  

//                         return(
//                         <View style={{marginVertical: 12}} key={index}>
//                           <Text style={{color: '#282C50', fontSize: 18}}>
//                             {item.label}
//                           </Text>
//                           <Controller
//                             control={control}
//                             name={baseFormLabel}
//                             defaultValue={defaultVal1.current}
//                             rules={(()=>rules(item.type))()}
//                             render={({field: {onChange, onBlur, value}}) => (
//                               <TextInput
//                                 style={item.type=="description"? styles.description:styles.input}
//                                 placeholder={item.label}
//                                 onBlur={onBlur}
//                                 onChangeText={(e) => {
//                                   (item.type=='float' || item.type=='int') ? (()=>{
//                                     console.log(parseFloat(e));
//                                     console.log(isNaN(parseFloat(e)));
//                                     onChange(e);
//                                     if(isNaN(parseFloat(e))){
//                                        defaultVal1.current=e;
//                                     }else{
//                                         setValue(`${baseFormLabel}`, parseFloat(e));
//                                     }
//                                   })()
//                                   // :(item.type=='int') ? (()=>{
//                                   //   console.log(parseInt(e));
//                                   //   onChange(e)
//                                   //   setValue(`${item.label}`,
//                                   //   parseInt(e));
//                                   // })()
//                                   :(()=>{
//                                     console.log("else252:   " + e);
//                                     onChange(e)
//                                   })()
//                                 //   (item.type=='int') ? (()=>{console.log(parseInt(e));setValue(`${item.label}`,parseInt(e));onChange(e)})():
//                                 //   (item.type=='float') ? (()=>{!isNaN(parseFloat(e))? 
//                                 //     (()=>{console.log(e); onChange(e)})():
//                                 //     (()=>{setValue(`${item.label}`,parseFloat(e)); onChange(parseFloat(e))})()
//                                 //   })():
//                                 //   (()=>{setValue(`${item.label}`,e); onChange(e)})()
//                               }}
//                                 value={value}
//                                 defaultValue={""+defaultVal1.current}
//                                 multiline={item.type=="description"? true : false}
//                                 keyboardType={(item.type=='int' || item.type=='float') ? "number-pad":"default"}
//                               />
//                             )}
//                           />
//                           {
//                             errors && errors[categorySchema.title] && errors[categorySchema.title][item.label] && (
//                               (errors[categorySchema.title][item.label].type != 'required') && (<Text style={{ color: "red" }}>
//                                 {errorMessage(errors[categorySchema.title][item.label].type)}
//                               </Text>)
//                             )
//                           }
//                         </View>
//                         );
//                       }
//                     }
//                 })}
//                 {/* {submitView(categorySchema.title, isValid)} */}
//             </View>
//         </ScrollView>
//     );

// }

// const rules = (type) => {
//     if(type === 'int'){
//       // console.log('int');
//       return({
//         pattern:/^[0-9]*$|^NULL$/,
//         required: true,
//         min:1,
//         max:1200,
//       });
//     }
//     else if(type === 'float'){
//       // console.log('float');
//       return({
//         pattern: /^[+-]?([0-9]*[.])?[0-9]+$/,
//         required: true,
//         min:1,
//         max:1200,
//       });
//     }
//     // else if(type === 'description'){
//     //   // console.log('description');
//     //   return ({
//     //     // required: true
//     //   })
//     // }
//     else{
//       // console.log('string');
//       return ({
//         required: true
//       })
//     }
// }

// const errorMessage = (type) => {
//     if(type === 'min'){
//       return "The entered value is too SMALL";
//     }
//     else if(type === 'max'){
//       return"The entered value is too LARGE";
//     }
//     else if(type === 'pattern'){
//       return "Please check value's FORMAT";
//     }
//     else{
//       return "This field is required for submission"
//     }
// }

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