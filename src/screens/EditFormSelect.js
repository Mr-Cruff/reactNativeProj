import React, {useEffect, useState, useContext} from 'react';
import {
    ActivityIndicator,
    Text,
    Image,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jamaicanDateFormat, RedTrashCan } from '../services/Helpers';
import { FORM_STATUS_OBJ } from '../Constants';
//Mock Form MetaData
// const formFields = [
//   {
//     title: 'Culls & Mortality',
//     type: 'common',
//     fields: [
//       {label: 'Culls - Male', type: 'int', fieldName:"", placeholder:""},
//       {label: 'Mortality - Male', type: 'int'},
//       {label: 'Culls - Female', type: 'int', fieldName:"", placeholder:""},
//       {label: 'Mortality - Female', type: 'int'},
//       {label: 'Dead on Arrival', type: 'int'},
//     ],
//   },
//   {
//     title: 'Feed Inventory',
//     type: 'common',
//     fields: [
//       //Feed Inventory
//       {label: 'Feed Brought Forward (lbs)', type: 'float'},
//       {label: 'Feed Recieved (lbs)', type: 'float'},
//       {label: 'Feed Transferred (lbs)', type: 'float'},
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
//       {label: 'Water Consumption', type: 'float'},
//       {label: 'Bird Weight - Male', type: 'float'},
//       {label: 'Bird Weight - Female', type: 'float'},
//       {label: 'Uniformity - Male', type: 'float'},
//       {label: 'Uniformity - Female', type: 'float'},
//       {label: 'All Clocks on Time', type: 'option', options:['YES','NO']},
//       {label: 'Lights', type: 'option', options:['ON','OFF']},
//       {label: 'Lighting Hours', type: 'float'},
//       {
//           label: 'Temperature Min', 
//           type: 'time',
//           fields: [
//             {label: 'Min 1st Entry', type: 'float', view:'value-time'},
//             {label: 'Min 2nd Entry', type: 'float', view:'value-time'}
//           ]
//       },
//       {
//         label: 'Temperature Max', 
//         type: 'time',
//         fields: [
//           {label: 'Max 1st Entry', type: 'float', view:'value-time'},
//           {label: 'Max 2nd Entry', type: 'float', view:'value-time'}
//         ]
//       },
//       {label: 'Observation/Comments', type: 'description'},
//     ],
//   },
//   {
//     title: 'Eggs',
//     type: 'production',
//     fields: [
//       {
//         label: 'Hatching Eggs', 
//         type: 'multi-field', 
//         fields: [
//           {label: 'Hatching 1st Entry', type: 'int'},
//           {label: 'Hatching 2nd Entry', type: 'int'},
//           {label: 'Hatching 3rd Entry', type: 'int'},
//           {label: 'Hatching 4th Entry', type: 'int'},
//         ],
//       },
//       {label: 'Reject Eggs', type: 'multi-field', fields: [
//         {label: 'Rejects 1st Entry', type: 'int'},
//         {label: 'Rejects 2nd Entry', type: 'int'},
//         {label: 'Rejects 3rd Entry', type: 'int'},
//         {label: 'Rejects 4th Entry', type: 'int'},
//       ],
//       },
//       {label: 'Dumps', type: 'multi-field', fields: [
//         {label: 'Dumps 1st Entry', type: 'int'},
//         {label: 'Dumps 2nd Entry', type: 'int'},
//         {label: 'Dumps 3rd Entry', type: 'int'},
//         {label: 'Dumps 4th Entry', type: 'int'},
//       ],},
//       {label: 'Double Yolked Eggs', type: 'multi-field', fields: [
//         {label: 'Double Yolked 1st Entry', type: 'int'},
//         {label: 'Double Yolked 2nd Entry', type: 'int'},
//         {label: 'Double Yolked 3rd Entry', type: 'int'},
//         {label: 'Double Yolked 4th Entry', type: 'int'},
//       ],},
//       {label: 'Eggs Delivered', type: 'int'},
//       {label: 'Net Egg Weight', type: 'float'},
//       {label: 'Average Egg Weight', type: 'float'},
//       {label: 'Egg Room Temp (Wet)',
//           type: 'time',
//           fields: [
//             {label: 'Egg Wet 1st Entry', type: 'float', view:'value-time'},
//             {label: 'Egg Wet 2nd Entry', type: 'float', view:'value-time'}
//         ]
//       },
//       {label: 'Egg Room Temp (Dry)',
//       type: 'time',
//       fields: [
//         {label: 'Egg Dry 1st Entry', type: 'float', view:'value-time'},
//         {label: 'Egg Dry 2nd Entry', type: 'float', view:'value-time'}
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

const EditFormSelect = ({navigation, back, route}) => {
    const [loading, setLoading] = useState(true);
    const [allForms, setAllForms] = useState([]);
    const [formsToView, setFormsToVIew] = useState(FORM_STATUS_OBJ[-1])
    const farms = route.params.farms;
    
    useEffect(() => {
      const focusHandler = navigation.addListener('focus', () => {
        setLoading(true);
        getFromsFromAsync();
          // console.log('Refreshed !!!!');
      });
      return focusHandler;
    }, [navigation]);

    const clearAllForms = async () => {
      try{
        await AsyncStorage.setItem('@forms', JSON.stringify([]));
      }catch(e){
        Alert.alert(e);
      }
    }

    const toggleFormView = () => {
      setFormsToVIew((current)=>current===FORM_STATUS_OBJ[-1]?"Submitted":FORM_STATUS_OBJ[-1])
    }
    //Gets Forms all forms from async storage and returns an array of forms
    const getFromsFromAsync = async () => {
        await AsyncStorage.getItem('@forms').then(
            (onResolved) => {
                // Do something on success
                // console.log("forms found");
                // console.log(onResolved);
                setAllForms(JSON.parse(onResolved));
                setLoading(false);
            },
            (onRejected) => {
                // Do something else on failure
                Alert.alert(
                    'Error !',
                    `Unable to load forms, try again.`,
                );
                setAllForms(null);
            }
        )
    }

    useEffect(() => {
       setLoading(false);
    }, [allForms]);

    const DateView = (date) => {
        let d = new Date(date);
        return d.toLocaleDateString()
    }

    const formSelected = (form) => {
      let selectedFarmHouse = {Farm:'', House:''}
      const farms = route.params.farms;
      for (let i=0; i<farms.length; i++){
          if(form["Farm"] == farms[i]['name']){
            for (let j=0; j<farms[i]['houses'].length; j++){
              if(form["House"] == farms[i]['houses'][j]["name"])
                selectedFarmHouse = {Farm:farms[i], House:farms[i]['houses'][j]}
            }
          }
        }
        // console.log(selectedFarmHouse);
        // console.log(form);
        // // console.log(selectedFarmHouse);
        // // let farms = JSON.parse(route.params);
        // // console.log(route.params.farms);
        navigation.navigate('Edit Form', {formSelected:form, farmSelected:selectedFarmHouse});
    }

    const deleteFormConfirmation =(formId)=>{
      Alert.alert(`Warning`, 
      `Are you sure you want to delete this form?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: `Yes, delete`, onPress: () => deleteForm(formId)}
      ])
    }

    const deleteForm = async (formId) =>{
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

    const NumberOfFormsSaved = ({size}) => {
      return <Text style={{alignSelf:'center', color:"#9EADD3", fontSize:16, marginTop:10}}>There are <Text style={{fontSize:16, color:'#17817d'}}>{size}</Text> forms saved on this device that need to be submitted</Text>
    }

    const CreateFormButton = (farms) => {
      const path="Create Form"
      const location = require('../resources/newForm.png');
      return(
          <TouchableOpacity
            style={styles.actionButton}
            onPress={props => navigation.navigate(path, {farms})}
            // onPress={props => navigation.navigate(path, {farms})}
            >
              <Image source={location} />
              {/* <Text style={{color: '#ffff', fontSize: 18, fontWeight: 'bold'}}>
                {' '}
                CREATE FORM{' '}
              </Text> */}
          </TouchableOpacity>
      )
    }

    let tempCount = 0;

    return(
        <View style={styles.container}>{
        (!loading) ?
        (<>
          <Text style={{fontSize:32, color:'#282C50', fontWeight:'bold', alignSelf:'center', marginTop:10,}}>SAVED FORMS</Text>
          <Text style={{fontSize:18, color:'#9EADD3', fontWeight:'400', alignSelf:'center', marginBottom:20}}>All forms saved on this device can be found below</Text>
          <View style={{backgroundColor:'beige', flexDirection:'row', justifyContent:'space-around',marginHorizontal:-20, paddingVertical:10}}>
            <View style={{justifyContent:'center', marginRight:50}}>
              <Text style={{color:'#9d9549'}}>Want to enter values for a new form?</Text>
              <Text style={{fontSize:24, color:'#282C50', fontWeight:'bold',}}>Create a new form here</Text>
            </View>
            <CreateFormButton farms={farms} />
          </View>
          {/*  
          <TouchableOpacity onPress={()=>clearAllForms()}>
            <Text>Clear all</Text>
          </TouchableOpacity>
          */}
          <TouchableOpacity style={{marginTop:20, paddingHorizontal:25, justifyContent:'flex-start',flexDirection:'row'}} onPress={()=>toggleFormView()}>
            <Text style={{fontSize:20, fontWeight:"normal", color:"#282C50"}}>{(formsToView === FORM_STATUS_OBJ[0])? FORM_STATUS_OBJ[1]:formsToView} Forms</Text>
            {/* <Text style={{alignSelf:'center'}}>Toggle Form View</Text> */}
          </TouchableOpacity>
          <View style={{height:'72%',}}>
          <ScrollView style={styles.innerContainer}>
            {allForms !== null ?
              Object.keys(allForms).map((form, formIndex)=>{
                if(allForms[formIndex]["Status"].toLowerCase().includes(formsToView.toLowerCase())){
                  tempCount+=1;
                  return(
                  <View key={formIndex}>
                      <TouchableOpacity  onPress={() => {formSelected(allForms[formIndex])}}>
                          <View style={{flexDirection:'row', backgroundColor:"#ffff", alignItems:'center', justifyContent:'space-between', elevation:3, borderRadius:10, padding:10, margin:10}}>
                            <View style={{ width:'88%',}}>
                              <View style={{flexDirection:'row',justifyContent:'space-between',}}>
                                <View style={{flexDirection:'row',}}>
                                  <Text style={{fontSize:16, color:'grey',marginLeft:10}}>{tempCount}.</Text>
                                  <Text style={{fontSize:16, color:'black',fontWeight:'bold',marginHorizontal:10, width:170}}>{allForms[formIndex]["Farm"]}</Text>
                                </View>
                                <Text style={{fontSize:16, color:'black',marginHorizontal:10}}>{allForms[formIndex]["House"]?.toUpperCase()}</Text>
                                <Text style={{fontSize:16,marginHorizontal:10}}>Created By: {allForms[formIndex]["Created By"]}</Text>
                                <Text style={{fontSize:16,marginHorizontal:10}}><Text style={{color:'black', fontWeight:'bold'}}>{jamaicanDateFormat(new Date(allForms[formIndex]["Date Created"]))}</Text></Text>
                              </View>
                              {/* <Text style={{fontSize:16}}>{allForms[formIndex]["Status"]}</Text> */}
                            </View>
                            <TouchableOpacity style={{margin:5,alignSelf:'flex-end'}} onPress={()=>deleteFormConfirmation(allForms[formIndex]["Form Id"])}><RedTrashCan /></TouchableOpacity>
                          </View>
                      </TouchableOpacity>
                  </View>
                  )
                }
              }):<Text style={{fontSize:18, color:'#6C82BB', fontWeight:'400', alignSelf:'center', marginVertical:10}}>No Forms Found, create a new form to begin.</Text>
            }
          </ScrollView>
          </View>
          <NumberOfFormsSaved size={tempCount}/>
          <Text style={{fontSize:18, color:'#6C82BB', fontWeight:'400', alignSelf:'center', marginBottom:10}}>Please remember to SUBMIT all completed forms</Text>
        </>)
        : 
        (
          <View>
              <Text>Loading, Pease Wait</Text>
              <ActivityIndicator size="large" color="red" />
          </View>
        )}
    </View>
    )
}



export default EditFormSelect;

const styles = StyleSheet.create({
    container: {
      paddingTop: 10,
      paddingBottom: 20,
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: 10,
      backgroundColor: '#E0E8FC',
    },
    innerContainer: {
      paddingHorizontal:10

    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#282C50',
      // backgroundColor: 'beige',
      color: '#ffff',
      borderRadius: 10,
      padding: 10,
      width:150,
      // marginHorizontal:5,
      // marginLeft:20
      // marginVertical:10
    },
});