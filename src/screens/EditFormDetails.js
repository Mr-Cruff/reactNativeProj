import React, {useEffect, useState, useRef, useMemo} from 'react';
import {useAuth} from '../contexts/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Category} from '../components/formComponents/EditFormCategory';
import axios from 'axios';
import { FORM_STATUS_OBJ } from '../Constants';


// //Mock Form MetaData
// const formFields = [
//   {
//     title: 'Culls & Mortality',
//     type: 'common',
//     fields: [
//       {label: 'Culls - Male', type: 'int', fieldName:"", placeholder:""},
//       {label: 'Mortality - Male', type: 'int'},
//       {label: 'Culls - Female', type: 'int', fieldName:"", placeholder:""},
//       {label: 'Mortality - Female', type: 'int'},
//     ],
//   },
//   {
//     title: 'Feed Inventory',
//     type: 'common',
//     fields: [
//       //Feed Inventory
//       {label: 'Feed Brought Forward (tons)', type: 'float'},
//       {label: 'Feed Recieved (tons)', type: 'float'},
//       {label: 'Feed Transferred (tons)', type: 'float'},
//       {label: 'Feed Spoilage (lbs)', type: 'float'},
//       {label: 'Days in Inventory', type: 'float'},
//       //Feed Consumed
//       {label: 'Feed Time', type: 'time'},
//       {label: 'Feed Consumption Time', type: 'justTime'},
//       {label: 'Feed Consumed (lbs) -  Male', type: 'float'},   //Conditional fields based on gender
//       {label: 'Feed Consumed (lbs) -  Female', type: 'float'}, //Conditional fields based on gender
//       {label: 'Feed Distribution  - Male', type: 'option', options:['GOOD','POOR']},
//     ],
//   },
//   {
//     title: 'Miscellaneous',
//     type: 'common',
//     fields: [
//       {label: 'Water Consumption', type: 'string'},
//       {label: 'All Clocks on Time', type: 'option', options:['YES','NO']},
//       {label: 'Lights', type: 'option', options:['ON','OFF']},
//       {label: 'Lighting Hours', type: 'float'},
//       {
//           label: 'Temperature Min', 
//           type: 'time',
//           fields: [
//             {label: 'Min 1st Entry', type: 'time'},
//             {label: 'Min 2nd Entry', type: 'time'}
//           ]
//         },
//       {
//         label: 'Temperature Max', 
//         type: 'time',
//         fields: [
//           {label: 'Max 1st Entry', type: 'time'},
//           {label: 'Max 2nd Entry', type: 'time'}
//         ]
//       },
//       {label: 'Observation/Comments', type: 'string'},
//     ],
//   },
//   {
//     title: 'Eggs',
//     type: 'production',
//     fields: [
//       {
//         label: 'Hacthing Eggs', 
//         type: 'int', 
//         fields: [
//           {label: 'Hatching 1st Entry', timeCollected:'', type: 'tally'},
//           {label: 'Hatching 2nd Entry', type: 'tally'},
//           {label: 'Hatching 3rd Entry', type: 'tally'},
//           {label: 'Hatching 4th Entry', type: 'tally'},
//         ],
//       },
//       {label: 'Reject Eggs', type: 'int', fields: [
//         {label: 'Rejects 1st Entry', timeCollected:'', type: 'float'},
//         {label: 'Rejects 2nd Entry', type: 'float'},
//         {label: 'Rejects 3rd Entry', type: 'float'},
//         {label: 'Rejects 4th Entry', type: 'float'},
//       ],
//       },
//       {label: 'Dumps', type: 'int', fields: [
//         {label: 'Dumps 1st Entry', timeCollected:'', type: 'int'},
//         {label: 'Dumps 2nd Entry', type: 'int'},
//         {label: 'Dumps 3rd Entry', type: 'int'},
//         {label: 'Dumps 4th Entry', type: 'int'},
//       ],},
//       {label: 'Double Yolked Eggs', type: 'int', fields: [
//         {label: 'Double Yolked 1st Entry', timeCollected:'', type: 'int'},
//         {label: 'Double Yolked 2nd Entry', type: 'int'},
//         {label: 'Double Yolked 3rd Entry', type: 'int'},
//         {label: 'Double Yolked 4th Entry', type: 'int'},
//       ],},
//       {label: 'Total Eggs Produced', type: 'int'},
//       {label: 'Net Egg Weight', type: 'float'},
//       {label: 'Average Egg Weight', type: 'float'},
//       {label: 'Egg Room Temp (Wet)',
//           type: 'time',
//           fields: [
//             {label: 'Egg Wet 1st Entry', type: 'time'},
//             {label: 'Egg Wet 2nd Entry', type: 'time'}
//         ]
//       },
//       {label: 'Egg Room Temp (Dry)',
//       type: 'time',
//       fields: [
//         {label: '1st Entry', type: 'time'},
//         {label: '2nd Entry', type: 'time'}
//     ]},
//       {label: 'Egg Room Humidity (%)', type: 'float'},
//     ],
//   },
//   {
//     title: 'Vaccination',
//     type: 'pullet',
//     fields: [
//       {label: 'Type/Description', type: 'string'},
//       {label: 'Quantity', type: 'float'},
//       {label: 'Serial Number', type: 'string'},
//     ],
//   },
// ];

const EditFormDetails = ({route}) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [save, setSave] = useState(false);
  const [saveNSubmit, setSaveNSubmit] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [newSave, setNewSave] =useState();
  // const save = useRef(false);
  const [formId, setFormId] = useState();
  
  //all forms that come from asycnStorage
  const [forms, setForms] = useState([]);
  
  const [selected, setSelected] = useState(-10);
  
  const farmDetails = '';
  const houseSelected = '';
  const {Farm, House} = route.params.farmSelected;
  const initialForm = route.params.formSelected;
  
  //the form stored currently in async storage
  const [storedForm, setStoredForm] = useState({});
  const [updatedForm, setUpdatedForm] = useState({...initialForm});
  const formFields = route.params.formFields;
  
  const saveCount = useRef(0);
  const catCount = useRef(0);
  const submitValid = useRef({});
  const submitionIsValid = useRef(false);
  // const [saveCount, setSaveCount] = useState(formFields.length);

  //Number of Categories in the form metadata
  const saveMax = formFields.length;

  const recursiveFunc = (A, B) => {
    console.log("\n\n\n=====TOP");
    // console.log(A);
    console.log("1. " + JSON.stringify(A));
    console.log("2. " + typeof A);
    let res = {};
    if (typeof A === 'object' || typeof B === 'object') {
      // console.log(key);
      // console.log(typeof key);
      Object.keys({...A,...B}).map(key => { 
         recursiveFunc(A[key],B[key]);
      });
    } else {
      console.log("\n\n====  ELSE");
      console.log("A: "+A);
      console.log("B: "+B);
      res = {...res, ...(B || A)};
    }
    return res;
  };

  const addToNewForm = newCategory => {
    catCount.current++;
    console.log(catCount);
    setUpdatedForm(old => ({...old, ...newCategory}));
  };

  const saveForm = async () => {
    // saveCount.current= saveCount.current+1;
    // saveCount.current >= saveMax ? (() =>{Alert.alert("Notification","Form Saved Successfully.");setSaving(false);setSave(false);saveCount.current=0;})(): "";

    console.log('jhgfjhggckjc      kjhgvckuuj');
    let found=false;
    const arrForm = [updatedForm];

    const storedForms = await AsyncStorage.getItem('@forms');
    let storedFormsParsed = JSON.parse(storedForms);
    !saveNSubmit? Alert.alert("Notification", "Form Saved Successfully."):"";
    
    if (storedForms !== null) {
      storedFormsParsed.map(async (asyncForm, formIndex) => {
        if(storedFormsParsed[formIndex]['Form Id']==updatedForm['Form Id']){
          storedFormsParsed[formIndex] = {...storedFormsParsed[formIndex], ...updatedForm};
          found=true;
          try{
            // await AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed))
            // .then(()=>saveNSubmit? SubmitForm(updatedForm).then(AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed))):"");
            saveNSubmit? SubmitForm(updatedForm).then(()=>{storedFormsParsed[formIndex] = {...storedFormsParsed[formIndex], ...updatedForm}; AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed));console.log(updatedForm["Status"])}):AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed));
            // saveNSubmit? SubmitForm(updatedForm).then(form => {console.log(form); AsyncStorage.setItem('@forms', JSON.stringify(form))}):null;
          }catch(e){
            Alert.alert(e);
          }
        }
      });

      if(!found){
        console.log("this");
        let x = [...storedFormsParsed, ...arrForm]
        console.log(x);
        await AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed)).then(()=>saveNSubmit? SubmitForm(updatedForm):"");
      }
      
      // await AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed));
    } else {
      try {
        await AsyncStorage.setItem('@forms', JSON.stringify(arrForm));
      } catch (error) {
        //errorrr
      }
    }
  };

  const submitView = (label, isValid) => {
    console.log(label);
    console.log(isValid);
    submitValid.current={...submitValid.current, ...{[label]:isValid}}
    console.log(submitValid.current);
    Object.keys(submitValid.current).length == saveMax ? (()=>{
      let x;
      Object.keys(submitValid.current).map((key, keyIndex)=>{
        // console.log(key);
        // console.log(submitValid.current[key]);
        keyIndex==0 ? x=submitValid.current[key] : x=x&&submitValid.current[key];
      })      
      canSubmit == x ? '':setCanSubmit(x);
    })():'';
  }

  const updateFormStatus = () =>{
    let form = updatedForm;
    form["Status"] = FORM_STATUS_OBJ[1];
    setUpdatedForm(form);
  }

  const SubmitForm = async (form) => {
    // const json = JSON.stringify(form);
    // const json = JSON.parse(form);
    console.log(JSON.stringify(form));
    // console.log(auth.authData.token);

    const id = auth.authData.uuid;
    const config = {
      headers:{
        'Content-Type': "application/json",
        'Accept': "*/*",
        Authorization: 'bearer ' + auth.authData.token,
      },
      params: {
       _object:JSON.stringify(form),
      }
    }

    await axios.post(`https://devipbformdata.jabgl.com:84/api/FormDetails/submitFormDetails`, null, config).then((response) => {
    // await axios.post(`https://devipbformdata.jabgl.com:84/api/FormDetails/submitFormDetails`, {}, config).then((response) => {
      console.log(response.status);
      Alert.alert(
        `Success`, 
        `Your form has been successfully submitted`,
        [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ])
      console.log(response.message);
      updateFormStatus();
      // console.log(response.data);
    }).catch((error) => {
      Alert.alert(`Falied`, `Your form could NOT be submitted, please try again later.`)
      // console.log(error.request);
      console.log(error.response.status);
      console.log(error);
      // console.warn(error.request._url);
      // console.warn(error.request._headers);
      // updateFormStatus();
    })

    // 
  // axios({
  //   method: 'post',
  //   url: 'https://devipbformdata.jabgl.com:84/api/FormDetails/submitFormDetails',
  //   headers:{
  //     'Content-Type': 'application/json',
  //     Authorization: 'bearer ' + auth.authData.token
  //   },
  //   data: form
  // }).then(function (response) {
  //     console.log(response.status);
  //     console.log(response.data);
  //   }).catch(function (error) {
  //   console.log(error.response.config.data);
  //   console.log(error.response.data);
  // });

  }

  //check if form id is equal to stored form id and sends form from storage
  const initiateSubmit = async () => {
    await AsyncStorage.getItem('@forms').then((result)=>{
      console.log("======= Initial Form Id ====== ");
      console.log(initialForm["Form Id"]);
      // console.log(result);
      const asyncParsed = JSON.parse(result);
      Object.keys(asyncParsed).map((form, formIndex)=>{
        console.log("===== Async Form Id ===== ");
        console.log(asyncParsed[formIndex]["Form Id"]);
        if(initialForm["Form Id"]==asyncParsed[formIndex]["Form Id"]){
          SubmitForm(asyncParsed[formIndex]);
        }
      });
    });
  }

  const initiateSave = () => {
    catCount.current=0;
    // console.log(save);
    if(saveCount.current != 0){
      // console.log('if');
      setSave(false); 
      saveCount.current=0;
      initiateSave();
      return;
    }else{
      // console.log('else');
      // console.log(saveCount, save, saving);
      // setSaving(true);
    }
    setSave(true);
    // save.current=true;
    // Alert.alert(
    //   'Notification',
    //   `Go to 'EDIT FORM' to make further changes to this form`,
    // );
    // navigation.navigate('Home');
  };

  useEffect(() => {
    // setLoading(true);
    // if(save && (catCount.current == saveMax)){
    if((catCount.current == saveMax)){
      catCount.current=0;
      // console.log('Saving');
      saveForm();
    }
  }, [updatedForm]);

  // useEffect(() => {
  //   !loading  
  // }, [loading]);

  useEffect(() => {
    setStoredForm(route.params.formSelected);
    // setUpdatedForm(route.params.formSelected);
    setLoading(false);
  }, []);

  // const getFormFromAsync = async () => {
//   return await AsyncStorage.getItem('@forms');
// };
  // useEffect(() => {
  //   getFormFromAsync().then(
  //     (onResolved) => {
  //       // Some task on success
  //       setStoredForm(JSON.parse(onResolved)[0]);
  //       setLoading(false);
  //     },
  //     (onRejected) => {
  //       // Some task on failure
  //      Alert.alert(
  //         'Error !',
  //         `Unable to load form data, try again.`,
  //      );
  //     }
  //   )
  // }, []);


  //Change to facilitate Edit Form Parameters
  
  const FarmSummary = () => {
    return (
      <View
        style={{
          // backgroundColor: '#b892ff',
          backgroundColor: 'gold',
          // backgroundColor: '#ffc2e2',
          padding: 15,
          marginBottom: 30,
          elevation:3
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 18}}>Farm Type:</Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 18,
              }}>
              {Farm.type}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 18}}>Farm Name: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 18,
              }}>
              {Farm.name}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 18}}>House Selected: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 18,
              }}>
              {House.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingTop:10
          }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 18}}>Flock Number:</Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 18,
              }}>
              {House.flockNumber}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 18}}>Age: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 18,
              }}>
              {House.flockAge} Weeks
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 18}}>Flock Breed: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 18,
              }}>
              {House.flockBreed}
            </Text>

          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 18}}>Flock Housed: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 18,
              }}>
              {House.flockHoused}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const LoadingScreen = ({ message }) =>{
    return (
      <View>
        <Text>{message}</Text>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (!loading){
  return(
    <ScrollView>
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,
          color: '#282C50',
        }}>
        Edit Form
      </Text>
      <FarmSummary />
      {/* {console.log("\n\n=====EDIT FORM=====\n")} */}
            {formFields.map((item, index) => {
              let asyncData = {};
                Object.keys(storedForm).map((cat, catIndex) => {
                  if (cat == formFields[index].title && typeof storedForm[cat] == "object" && (Object.keys(storedForm[cat]).length != 0)){
                    asyncData=storedForm[cat];
                    // console.log("====Async=====");
                    // console.log(asyncData);
                  }
                });
                return <Category addToNewForm={addToNewForm} props={formFields[index]} key={index} asyncData={asyncData} save={save} setSave={setSave} newSave={ newSave } setNewSave={ setNewSave } saving={saving} setSaving={setSaving} submitView={submitView}/>;
                // return <Category addToNewForm={addToNewForm} props={formFields[index]} key={index} asyncData={asyncData} save={save} />;              
            })}
        <View style={{marginTop: 10, marginBottom: 20, alignItems: 'center'}}>
          <View style={{flexDirection:"row"}}>
            {/* <TouchableOpacity
              // disabled={!canSubmit}
              // style={canSubmit?styles.saveButton:styles.saveButtonDisabled}
              style={styles.saveButton}
              onPress={()=>setNewSave(true)}>
              <Text style={{fontSize: 20, color:'#560909', fontWeight: 'bold'}}>
              {/* <Text style={{fontSize: 20, color: canSubmit? '#560909': 'grey', fontWeight: 'bold'}}>//} 
                NEW SAVE
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              // disabled={!canSubmit}
              // style={canSubmit?styles.saveButton:styles.saveButtonDisabled}
              style={styles.saveButton}
              onPress={initiateSave}>
              <Text style={{fontSize: 20, color:'#560909', fontWeight: 'bold'}}>
              {/* <Text style={{fontSize: 20, color: canSubmit? '#560909': 'grey', fontWeight: 'bold'}}> */}
                SAVE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!canSubmit}
              style={canSubmit? styles.button : styles.buttonDisabled}
              onPress={()=>{setSaveNSubmit(true);initiateSave();}}>
              <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                SAVE & SUBMIT
              </Text>
            </TouchableOpacity>
          </View>      
        </View>
    </View>
    </ScrollView>
  );
  }else{
    return  (
      <LoadingScreen message="Loadingh, please wait ..." />
      )
    }
};

export default EditFormDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    backgroundColor: '#E0E8FC',
  },
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#560909',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    borderRadius: 2,
    width: 300,
    marginHorizontal:10
  },
  saveButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#E0E8FC',
    color: '#560909',
    borderColor: '#560909',
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    width: 300,
    marginHorizontal:10
  },
  saveButtonDisabled: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#E0E8FC',
    color: '#560909',
    borderColor: 'grey',
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    width: 300,
    marginHorizontal:10
  },
  buttonDisabled: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'grey',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    width: 300,
    marginHorizontal:10
  },
});
