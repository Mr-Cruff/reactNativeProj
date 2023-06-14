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
import { ActivityIndicator, RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Category, CategoryController, EditFormIcon, executeApiQuery, timeConvert, timeConverter, WhitePlus, WhiteX, WhiteTick} from '../services/Helpers';
// import {Category} from '../components/formComponents/EditFormCategory';
import axios from 'axios';
import { APP_API, FORM_STATUS_OBJ } from '../Constants';
import { GlobalContext } from '../contexts/GlobalContext';


// ToDo: Consider adding render animation to make transitions more seamless
const ReviewAndEdit = ({ route, navigation:nav }) => {
    const { formSchema:formFields } = useContext(GlobalContext);
    const { token, name } = useAuth().authData;
    // const [loading, setloading] = useState(false);
    const [allowEdit, setAllowEdit] = useState(false);
    const [allowRejection, setRejection] = useState(false);
    const retrievedForm = JSON.parse(route.params.retrievedForm.Data);
    // console.log("=======================================================================");
    console.log(route.params.retrievedForm.Data);
    const { "Form Id":formId, Farm, House } = retrievedForm;
    const farm = {farm:Farm, type:"Eggs" in retrievedForm? "Production" : "Grow", house:House}
    const form = useForm({mode: "onChange"});
    
    const onSubmit = data => {
      console.log("On Submit: ");
      //   setloading(true);
      const adjustedForm = {...baseFormDetails, ...data}
      adjustedForm.Status = FORM_STATUS_OBJ[1];
      console.log(adjustedForm);
    //   console.log(adjustedForm.Status);
      resubmitForm(adjustedForm);
    }; 

    const resubmitForm = async (form) => {
      // console.log(JSON.stringify(form), token, form["Form Id"], form["Status"]);
      const params= {
        // _object:JSON.stringify(form),
        formid:form["Form Id"],
      }
      // await axios.post(`${APP_API}/api/FormDetails/re-submitFormDetails`, null, config)
      executeApiQuery('/api/FormDetails/re-submitFormDetails',token,'post',JSON.stringify(form),params)
      // executeApiQuery('/api/FormDetails/submitFormDetails',token,'post',JSON.stringify(form),undefined)
      .then((response) => {
        console.log(response.data);
        Alert.alert(
          `Success`, 
          `Your form has been successfully SUBMITTED`,
          [
            {text:'OK, Close Form', onPress: ()=> nav.goBack()}
          ]
        )
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert(`Falied`, `Your form could NOT be submitted, please try again later. \nERROR MESSAGE:${error.message}`)
      })
    } 

    // const saveForm = async (form) => {
    //   let found=false;
    //   const arrForm = [form];
  
    //   const storedForms = await AsyncStorage.getItem('@forms');
    //   let storedFormsParsed = JSON.parse(storedForms);
      
    //   if (storedForms !== null) {
    //     storedFormsParsed.map(async (asyncForm, formIndex) => {
    //       if(storedFormsParsed[formIndex]['Form Id']==form['Form Id']){
    //         storedFormsParsed[formIndex] = {...storedFormsParsed[formIndex], ...form};
    //         found=true;
    //         try{
    //           await AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed)).then(console.log('formsaved: '));
    //         }catch(e){
    //           Alert.alert(e);
    //         }
    //       }
    //     });
  
    //     if(!found){
    //       console.log("this");
    //       let x = [...storedFormsParsed, ...arrForm]
    //       await AsyncStorage.setItem('@forms', JSON.stringify(x));
    //     }
  
    //   } else {
    //     try {
    //       await AsyncStorage.setItem('@forms', JSON.stringify(arrForm));
    //     } catch (error) {
    //       //errorrr
    //     }
    //   }
    // };
    
    const getFormFields = () => {
      let header={};
      Object.keys(retrievedForm).map((field, indx) => {
        if(typeof retrievedForm[field] != "object"){
          header = {...header, ...{[field] : retrievedForm[field]}};
        }
      })
      return header
    }

    const EditView =()=>{
        if(!allowEdit)
            return(
                <View style={{backgroundColor:'beige', flexDirection:'row', justifyContent:'space-evenly',marginHorizontal:-20, paddingVertical:10}}>
                  <View style={{justifyContent:'center', marginRight:50}}>
                    <Text style={{color:'#9d9549'}}>See something wrong with this form submission?</Text>
                    <Text style={{fontSize:26, color:'#282C50', fontWeight:'bold',}}>TURN EDITING ON</Text>
                  </View>
                  <TouchableOpacity style={[styles.actionButton,{width:'auto'}]} onPress={()=>setAllowEdit(!allowEdit)}>
                    <EditFormIcon size={40} />
                    <Text style={{color:'white', fontSize:18, fontWeight:'bold', marginLeft:'3%'}}>EDIT FORM</Text>
                  </TouchableOpacity>
                </View>
            );
        else{
            return(
                <View style={{backgroundColor:'beige', flexDirection:'row', justifyContent:'space-around',marginHorizontal:-20, paddingVertical:10}}>
                  <View style={{justifyContent:'center', marginRight:50}}>
                    <Text style={{color:'#9d9549'}}>Dont't want to edit this form?</Text>
                    <Text style={{fontSize:24, color:'#282C50', fontWeight:'bold',}}>TURN EDITING OFF</Text>
                  </View>
                  <TouchableOpacity style={[styles.actionButton,{width:'auto', backgroundColor:'#81171b'}]} onPress={()=>setAllowEdit(!allowEdit)}>
                    <EditFormIcon size={40} />
                    <Text style={{color:'white', fontSize:18, fontWeight:'bold', marginLeft:'3%'}}>STOP EDITING</Text>
                  </TouchableOpacity>
                </View>
            );
        }
    }

    // const approveForm = async () => { 
    //     executeApiQuery(`/api/FormDetails/formID?formId=${formId}`,token,'patch',{statusId:FORM_STATUS_OBJ[1], approverComments:["Approved"], approvedBy:name},undefined)
    //     .then(function (response) {
    //       console.log(response.status);
    //       Alert.alert(
    //         'Success',
    //         `Form review submitted successfully`, // <- this part is optional, you can pass an empty string
    //         [{text:'OK, Close Form', onPress: ()=> nav.goBack()}]
    //         )
    //     }).catch((err)=>{
    //         Alert.alert(
    //         'Failed',
    //         `ERROR: ${err.message}`, // <- this part is optional, you can pass an empty string
    //         )
    //     });
    // }

    const ActionButton =({ props })=>(
        <TouchableOpacity style={[styles.actionButton,{justifyContent:'space-around', width:'auto',backgroundColor:props.buttonColor?props.buttonColor:"#282C50"}]} onPress={(e)=> props.function === null? form.handleSubmit(onSubmit)(e):props.function()}>
            <props.icon  size={props.size} />
            <Text style={{color:'white', fontSize:18, fontWeight:'bold', marginHorizontal:'2%', alignSelf:'center'}}>{props.label}</Text>
        </TouchableOpacity>
    );

    const RejectMenu = () => {
        const [reasons, setReasons] = useState(['']);
        const [isEmpty, setIsEmpty] = useState(true);
        const auth = useAuth();
    
        return(
            <View style={{backgroundColor:'#fbe9ea', borderRadius:10,}}>
                <View style={{backgroundColor:'#81171b', flexDirection:'row',justifyContent:'space-between', elevation:1,}}>
                    <Text style={{color:'white', fontSize:20, fontWeight:'bold', paddingHorizontal:10,}}>Rejection Reasons</Text>
                    <TouchableOpacity style={{alignSelf:'center', marginRight:"0.5%"}} onPress={toggleRejection}><WhiteX size={20}/></TouchableOpacity>
                </View>
                {reasons.map((reason, indx)=>
                    <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, backgroundColor:indx%2==0?'#f9ddde':""}} key={indx}>
                        <Text>{indx+1}. </Text>
                        <TextInput placeholder="Enter Reason here" onChangeText={text => {text == ""? setIsEmpty(true):setIsEmpty(false); reasons[indx]=text}}>{reason}</TextInput>
                    </View>)}
                    <View style={{flexDirection:'row', backgroundColor:'#f9ddde', justifyContent:'center', padding:10,}}>
                        <TouchableOpacity disabled={isEmpty} style={{width:150, minHeight:50, backgroundColor:reasons[0]=='' ? 'grey':'#17817d', marginRight:100, justifyContent:'center', alignItems:'center', borderRadius:8, flexDirection:'row'}} onPress={()=>{setReasons([...reasons, ""])}}><WhitePlus size={30} /><Text style={{color:'white',}}>REASON</Text></TouchableOpacity>
                        <TouchableOpacity disabled={reasons[0]==''?true:false} style={{width:200, backgroundColor:reasons[0]=='' ? 'grey':'#81171b', justifyContent:'center', alignItems:'center',borderRadius:8}} onPress={()=>{submitRejection(reasons)}}><Text style={{color:'white', fontWeight:'500'}}>SUBMIT REJECTION</Text></TouchableOpacity>
                    </View>
                {/* {console.log(reasons)} */}
            </View>
        );
    
    }

    const submitRejection = async (reasons) => {
        console.log(formId, token, name);
        //Make Rejection Query Here *************        
        executeApiQuery(`/api/FormDetails/formID?formId=${formId}`,token,'patch',{statusId:FORM_STATUS_OBJ["Rejected"], approverComments:[...reasons], rejectedBy:name},undefined)
        .then(function (response) {
        //   console.log(reasons);
        //   console.log(response.status);
          // console.log(response.data);
          Alert.alert(
            'Success',
            `Form review submitted successfully`,
            [{text:'Close Form', onPress: ()=> nav.goBack()}] // <- this part is optional, you can pass an empty string
            
            )
        }).catch((err)=>{
            Alert.alert(
            'Failed',
            `${err.message}`, // <- this part is optional, you can pass an empty string
            )
        });
    }
    const ButtonMenu =()=>(
        <View style={{flexDirection:'row', justifyContent:'space-evenly',marginVertical:20, marginBottom:30}}>
            <ActionButton props={{"function":null, label:"Final Submission", icon:WhiteTick, size:42}}/>
            <ActionButton props={{"function":toggleRejection, label:"Reject Menu", icon:WhiteX, size:40, buttonColor:'#81171b'}}/>
        </View>
    )
    const toggleRejection =()=>setRejection(!allowRejection);

    const baseFormDetails = getFormFields();  

    return(
        <ScrollView style={{backgroundColor:'#E0E8FC'}}>
            <Text style={styles.header}>SUBMISSION REVIEW</Text>
            <EditView />
            <RenderForm formFields={formFields} retrievedForm={retrievedForm} form={form} allowEdit={allowEdit} farm={farm} />
            {!allowEdit && allowRejection && <RejectMenu />}
            {!allowEdit && !allowRejection && <ButtonMenu />}
            {allowEdit && <View style={{width:'auto', alignSelf:'center',marginBottom:'5%',marginTop:'2%'}}><ActionButton props={{"function":null, label:"Final Submission", icon:WhiteTick, size:42}}/></View>}
            {/* {allowEdit && <View style={{width:180, alignSelf:'center',marginBottom:'5%',marginTop:'2%'}}>
                            <TouchableOpacity style={[styles.actionButton,{justifyContent:'space-between', width:'auto'}]} onPress={(e)=>form.handleSubmit(onSubmit)(e)}>
                            <WhiteTick size={40} />
                            <Text style={{color:'white', fontSize:18, fontWeight:'bold', marginHorizontal:'3%', alignSelf:'center'}}>Final Submit</Text>
                            </TouchableOpacity>
                           </View>} */}

            {/* {!loading ? <TouchableOpacity style={formState.isValid ? formState.isDirty? styles.button: styles.saveButtonDisabled:styles.saveButtonDisabled} disabled={!formState.isValid || !formState.isDirty} onPress={(e)=>form.handleSubmit(onSubmit)(e)}>
              <Text style={formState.isValid ? formState.isDirty? styles.buttonText: {color:"grey"}:{color:"grey"}}>SAVE & SUBMIT</Text>
            </TouchableOpacity> : <ActivityIndicator style={{marginVertical:40}} size="large" color="#282C50" />} */}
            {/* <View style={{height:'10%'}}></View> */}
        </ScrollView>
    );
}

export default ReviewAndEdit;

// const RenderForm = ({ formFields, retrievedForm, form, farm, house }) => {
//   console.log(farm.house);

//     return(
//         <View>
//             {
//               Object.keys(formFields).map((key, index)=>{
//                 return(
//                   <CategoryController categorySchema={formFields[key]} retrievedData={retrievedForm[formFields[key].title]} form={form} key={index} farm={farm}/>
//                 )
//               })
//             }
//         </View>
//     )
// }
const RenderForm = ({ formFields, retrievedForm, form, allowEdit, farm }) => {
    return(
        <View>
            {
              Object.keys(formFields).map((key, index)=>{
                // console.log("=======================================================================");
                // console.log(!retrievedForm[formFields[key].title]);
                return retrievedForm[formFields[key].title] && (
                    <CategoryController categorySchema={formFields[key]} retrievedData={retrievedForm[formFields[key].title]} form={form} key={index} allowEdit={allowEdit} farm={farm}/>
                )
                //   console.log(formFields[key].title, retrievedForm[formFields[key].title])
              })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      marginHorizontal: 20,
    },
    header:{
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
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#282C50',
        // backgroundColor: 'beige',
        color: '#ffff',
        borderRadius: 10,
        padding: 15,
        width:150,
        // marginHorizontal:5,
        // marginLeft:20
        // marginVertical:10
      },
});