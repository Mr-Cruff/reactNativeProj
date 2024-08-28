import React, {useEffect, useState, useRef, forwardRef} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native'
import {
  Alert,
//   ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import {useAuth} from '../contexts/Auth';
import axios from 'axios';
import { timeConvert, timeConverter, WhitePlus, WhiteTick, WhiteX } from '../services/Helpers';
import { FORM_STATUS_OBJ } from '../Constants';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../contexts/GlobalContext';
// import {Picker} from '@react-native-picker/picker';
// import Header from '../components/Header';
// import {FarmTile} from '../components/Dashboard';
// import {SubFields} from '../components/SubFieldTally';
// import Culls from '../components/formComponents/EditFormCategory';
// import GenForm from './GeneralForm';

const formSchema = [];

const FormReview = ({route, navigation, back}) => {
    const auth = useAuth();
    // const rejectingForm = useRef();
    const rejectPage = useRef();
    const [loading, setLoading] = useState(true);
    const [reject, setReject] = useState(false);
    const [theForm, setTheForm] = useState({});
    const { form, farm, house, createdBy } = route.params;

    useEffect(()=>{
        setTheForm(parseForm(formSchema, form));
        setLoading(false);
    },[]);
    
    useEffect(()=>{
        if (reject){
            rejectPage.current.scrollToEnd({ animated: true })
            // if(rejectingForm && rejectingForm.current) {
        //         const reactTag = findNodeHandle(rejectingForm.current);
        //     if (reactTag) {
        //       AccessibilityInfo.setAccessibilityFocus(reactTag);
        //     }
            // rejectingForm.current.focus();
        //  }
     }
    },[reject]);
    // console.log(schema);
    return(
        <ScrollView style={styles.container} ref={rejectPage}>
            <View style={{marginBottom:30}}>
                <Text style={styles.header}>FORM REVIEW</Text>
                <FormDetailsTile farm={farm} form={form} house={ house } createdBy={createdBy}/>
                <View style={{marginHorizontal:'5%'}}>
                    {!loading && <FormTileRefactored form={theForm}/>}
                </View>
                {reject && <RejectMenu navigation={navigation} id={form.FormId} />}
                {!reject &&<View style={{flexDirection:'row', justifyContent:'center', marginVertical:10}}>
                    <TouchableOpacity style={styles.approveButton} onPress={() => approveButton(form.FormId, auth, navigation)}><WhiteTick size={50} /><Text style={{color:'white', fontWeight:'600', fontSize:20, marginLeft:20}}>APPROVE</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => rejectButton(setReject)}><WhiteX size={40}/><Text style={{color:'white', fontWeight:'600', fontSize:20, marginLeft:20}}>REJECT</Text></TouchableOpacity>
                </View>}
            </View>
        </ScrollView>
    )
}

// const RejectMenu = forwardRef((props, ref) => {
//     const [reasons, setReasons] = useState(['']);
//     const auth = useAuth();
//     return(
//         <View ref={ref}>
//             <Text style={{backgroundColor:'red', color:'white', fontSize:18, fontWeight:'bold'}}>Rejection Reasons</Text>
//             {reasons.map((reason, indx)=>
//                 <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10}} key={indx}>
//                     <Text>{indx+1}. </Text>
//                     <TextInput placeholder="Enter Reason here" onChangeText={text=>reasons[indx] = text}>{reason}</TextInput>
//                 </View>)}
//             <TouchableOpacity onPress={()=>{setReasons([...reasons, ""])}}><Text>Add another Reason</Text></TouchableOpacity>
//             <TouchableOpacity onPress={()=>{submitRejection(props.id, auth, reasons)}}><Text>Submit Rejection</Text></TouchableOpacity>
//             {console.log(reasons)}
//         </View>
//     );

// });
const RejectMenu = ({ id, navigation }) => {
    const [reasons, setReasons] = useState(['']);
    const [isEmpty, setIsEmpty] = useState(true);
    const auth = useAuth();

    return(
        <View style={{backgroundColor:'#fbe9ea', marginHorizontal:'5%', borderRadius:10}}>
            <Text style={{backgroundColor:'#81171b', color:'white', fontSize:20, fontWeight:'bold', paddingHorizontal:10, borderTopRightRadius:5, borderTopLeftRadius:5, elevation:1}}>Rejection Reasons</Text>
            {reasons.map((reason, indx)=>
                <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, backgroundColor:indx%2==0?'#f9ddde':""}} key={indx}>
                    <Text>{indx+1}. </Text>
                    <TextInput placeholder="Enter Reason here" onChangeText={text => {text == ""? setIsEmpty(true):setIsEmpty(false); reasons[indx]=text}}>{reason}</TextInput>
                </View>)}
                <View style={{flexDirection:'row', backgroundColor:'#E0E8FC', justifyContent:'center', padding:10}}>
                    <TouchableOpacity disabled={isEmpty} style={{width:150, minHeight:50, backgroundColor:reasons[0]=='' ? 'grey':'#17817d', marginRight:100, justifyContent:'center', alignItems:'center', borderRadius:8, flexDirection:'row'}} onPress={()=>{setReasons([...reasons, ""])}}><WhitePlus size={30} /><Text style={{color:'white',}}>REASON</Text></TouchableOpacity>
                    <TouchableOpacity disabled={reasons[0]==''?true:false} style={{width:200, backgroundColor:reasons[0]=='' ? 'grey':'#81171b', justifyContent:'center', alignItems:'center',borderRadius:8}} onPress={()=>{submitRejection(id, auth, reasons, navigation)}}><Text style={{color:'white', fontWeight:'500'}}>SUBMIT REJECTION</Text></TouchableOpacity>
                </View>
            {/* {console.log(reasons)} */}
        </View>
    );

}

const approveButton = (id, auth, nav) =>{
    Alert.alert(
            'Alert',
            'Are you sure you\'d like to APPROVE this form?', // <- this part is optional, you can pass an empty string
            [
              {text: 'Yes, Approve', onPress: () => approveForm(id, auth, nav)},
              {text: 'No, Cancel', },
            ],
        );
}

const rejectButton = (e) =>{
    Alert.alert(
            'Alert',
            'Are you sure you\'d like to REJECT this form?', // <- this part is optional, you can pass an empty string
            [
              {text: 'Yes, Reject', onPress: () => rejectForm(e)},
              {text: 'No, Cancel', },
            ],
        );
}

const rejectForm = (e) => {
    e(true);
    // Alert.alert(
    //     'Success',
    //     'Form Approved Successfully', // <- this part is optional, you can pass an empty string
    // );
}

const submitRejection = async (formId, auth, reasons, nav) => {
    console.log(formId);
    //Make Rejection Query Here *************
    // console.log(auth.authData.token);
    const config = {
        headers:{
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + auth.authData.token
        },
      //   params:{
      //     formID:formId
      //   }
    }
    
    await axios.patch(`https://devipbformdata.jabgl.com:84/api/FormDetails/formID?formId=${formId}`, {statusId:3, approverComments:[...reasons]}, config)
    .then(function (response) {
      console.log(reasons);
      console.log(response.status);
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

const approveForm = async (formId, auth, nav) => { 
    // console.log(auth.authData.token);
    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + auth.authData.token
      },
    //   params:{
    //     formID:formId
    //   }
    }

    await axios.patch(`https://devipbformdata.jabgl.com:84/api/FormDetails/formID?formId=${formId}`, {statusId:2, approverComments:["Approved"], approvedBy:''}, config)
    .then(function (response) {
      console.log(response.status);
      // console.log(response.data);
      Alert.alert(
        'Success',
        `Form review submitted successfully`, // <- this part is optional, you can pass an empty string
        [{text:'OK, Close Form', onPress: ()=> nav.goBack()}]
        )
    }).catch((err)=>{
        Alert.alert(
        'Failed',
        `${err.message}`, // <- this part is optional, you can pass an empty string
        )
    });
}

const FormDetailsTile = ({ farm, form, house, createdBy }) =>{
    return(
        <View style={styles.FormDetailsTileContainer}>
            <View style={{flexDirection:'row', justifyContent:'center', backgroundColor:'#73ba9b', padding:5, borderTopLeftRadius:5, borderTopRightRadius:5,}}>
                <Text style={{color:'#282C50', fontSize:20, fontWeight:'500', paddingHorizontal:10}}>{farm.name}</Text>
                <Text style={{color:'black', fontSize:20, fontWeight:'300'}}>-</Text>
                <Text style={{color:'#282C50', fontSize:20, fontWeight:'500',paddingHorizontal:10}}>{house}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-around', paddingVertical:10,marginBottom:5}}>
                <View>
                    {/* {console.log(form)} */}
                    <Text>Created By: {InnerText(createdBy)}</Text>
                    <Text>Date Created: {InnerText(new Date(form.DateCreated).toDateString())}</Text>
                </View>
                <View>
                    <Text>Date Submitted: {InnerText(new Date(form.DateCaptured).toDateString())}</Text>
                    <Text>Status: {InnerText(FORM_STATUS_OBJ[form.StatusId])}</Text>
                </View>
            </View>
        </View>
    )
}

const FormTileRefactored = ({ form }) =>{
    return(
        Object.keys(form).map((key, index) => {
            return(
                <View style={{marginVertical:10, backgroundColor:'white', }} key={index}>
                    <Text style={styles.categoryLabel}>{extractLabel(key)}</Text>
                    <View style={{padding:5}}> 
                    {
                        Object.keys(form[key]).map((subKey, index) => { 
                            return(
                                typeof form[key][subKey] == "object" ? (
                                    <View style={{marginBottom:-5,}} key={index}>
                                        {form[key][subKey].length != 1 && <Text style={{fontSize:16, fontWeight:'500',width:"100%", alignSelf:'center', backgroundColor:'#5d66ae', textAlign:'center', color:'white', marginTop:5}}>{subKey}</Text>}
                                        {
                                            Object.keys(form[key][subKey]).map((subSubKey, subIndex) => { 
                                                return(
                                                    <>
                                                        <View style={{flexDirection:'row', backgroundColor:subIndex%2==0?"#f8f9fa":"white", }} keu={subIndex}>
                                                            {
                                                                form[key][subKey][subSubKey].length != 1 && 
                                                                    <View style={{backgroundColor:"#d5f2e3", fontSize:15, width:'30%', justifyContent:'center', marginRight:20, height:"auto", marginBottom:subSubKey!= form[key][subKey][subSubKey].length-1? 5:0}}>
                                                                        <Text style={{backgroundColor:"#d5f2e3", fontSize:15, fontWeight:'500', fontStyle:'italic', width:'100%', textAlign:'center', justifyContent:'center', paddingVertical:5}}>
                                                                            {<RenderValue value={subSubKey} />}
                                                                        </Text>
                                                                    </View>
                                                            }
                                                            <View style={{}}>
                                                                {Object.keys(form[key][subKey][subSubKey]).map((deepSubKey, deepIndex) => { 
                                                                    return <Text key={deepIndex} style={{fontSize:18}}>{ extractLabel(deepSubKey)}: {deepSubKey.includes("Time") ? <RenderValue value={timeConvert(new Date(form[key][subKey][subSubKey][deepSubKey]).toLocaleTimeString())} />: <RenderValue value={form[key][subKey][subSubKey][deepSubKey]} /> }</Text>
                                                                })}
                                                            </View>
                                                        </View>
                                                    </>
                                                )
                                            }
                                        )}
                                    </View>
                                ):<Text style={{fontSize:18}} >{extractLabel(subKey)}: {subKey.includes("Time") ? subKey == "FeedTime" ? <RenderValue value={timeConverter(new Date(form[key][subKey]))} />: <RenderValue value={timeConvert(new Date(form[key][subKey]).toLocaleTimeString())} /> : <RenderValue value={form[key][subKey]} />}</Text>
                            )
                        })
                    }
                    </View> 
                </View>
            )
        })
    )


    // return(
    //     <View style={{}}>
    //         <Text>{extractLabel}: </Text>
    //     </View>
    // )
}

const RenderValue = ({ value }) =>{
    return <Text style={{fontSize:18, fontWeight:"400", color:"black",}}>   {value}</Text>
}

const FormTile = ({ farm, form }) =>{
    return(
        Object.keys(form).map((key, index) => {
            if(form[key] != null){
                if (typeof form[key] != 'object'){
                    return(
                        <Text>{extractLabel(key)}: {form[key]}</Text> 
                        )
                    }
                    else{
                        return(
                            <View style={{marginVertical:10, backgroundColor:'white', }}>
                            <Text style={styles.categoryLabel}>{extractTblLabel(key)}</Text>
                            <View style={{padding:5}}> 
                                {
                                    // console.log(key, form[key].length)
                                    form[key].length != 0 ? (
                                        Object.keys(form[key]).map((subKey, index) => { 
                                            return(
                                                <View>
                                                    {form[key].length != 1 && <Text style={{fontSize:16, fontWeight:'500', width:'80%', alignSelf:'center', margin:10, backgroundColor:'#E0E8FC', textAlign:'center'}}>ENTRY - {Number(index+1)}</Text>}
                                                    {Object.keys(form[key][subKey]).map((subSubKey, index) => { 
                                                       return <Text>{subSubKey}: {form[key][subKey][subSubKey]}</Text>
                                                    })}
                                                </View>
                                            )
                                        })
                                    ):("")
                                }
                            </View> 
                        </View>
                    )
                }
            }
        })
    )
    // return(
    //     <View style={{}}>
    //         <Text>{extractLabel}: </Text>
    //     </View>
    // )
}

const InnerText = (text) => {
    return <Text style={{fontWeight:'600', fontStyle:'italic', color:'black', fontSize:16 }}>{text}</Text>
}

const extractTblLabel = (str) => {
    return str.replace(/^([tT]bl)/, "").split(/(?=[A-Z])/).join(" ");
}

const extractLabel = (str) => {
    return str.split(/(?=[A-Z])/).join(" ");
}

const parseForm = (schema, form) => {
    // console.log("here:");
    Object.keys(schema).map((category, catIndx)=>{
        // console.log("   ==============================   " + category + "   ==============================   ");
        Object.keys(schema[category]).map((subCategory, subCatIndx)=>{
            // console.log(subCategory, typeof schema[category][subCategory]);
            // console.log(typeof schema[category][subCategory]);
            if (typeof schema[category][subCategory] != 'string'){
                Object.keys(schema[category][subCategory]).map((subSubCategory, subSubCatIndx)=>{
                    // console.log(subSubCategory,subSubCatIndx);
                    if (typeof schema[category][subCategory][subSubCategory] != 'string'){
                        Object.keys(schema[category][subCategory][subSubCategory]).map((deepCategory, deepCatIndx)=>{
                            const x = checkForm(deepCategory, subSubCatIndx,form);
                            x != undefined ? schema[category][subCategory][subSubCategory][deepCategory] = x : 'Not Found !!!';
                            // schema[category][subCategory][subSubCategory][deepCategory] = checkForm(deepCategory, form);
                            // console.log(deepCategory, schema[category][subCategory][subSubCategory][deepCategory]);
                            // schema[category][subCategory][subSubCategory][deepCategory] = console.log(checkForm(deepCategory, form));
                            // console.log(checkForm(deepCategory, form));
                            // console.log(schema[category][subCategory][subSubCategory][deepCategory]);
                            // if (typeof schema[category][subCategory][subSubCategory][deepCategory] != 'string'){
                            //     Object.keys(schema[category][subCategory][subSubCategory][deepCategory]).map((deepDeepCategory, deepDeepCatIndx)=>{
                            //         // schema[category][subCategory][subSubCategory]=checkForm(deepCategory, form);
                            //         console.log(subSubCategory, schema[category][subCategory][subSubCategory]);
                            //     });
                            // }else{
                            //     schema[category][subCategory][subSubCategory] = checkForm(subSubCategory, form);
                            //     console.log(subSubCategory, schema[category][subCategory][subSubCategory]);
                            // }
                        });
                    }else{
                        // schema[category][subCategory][subSubCategory] = checkForm(subSubCategory, form);
                        // console.log(subSubCategory, schema[category][subCategory][subSubCategory]);
                    }
                });
            }else{
                // schema[category][subCategory] = checkForm(subCategory, form);
                const x = checkForm(subCategory, 0,form);
                x != undefined ? schema[category][subCategory] = x : 'Not Found !!!';
                // // console.log(subCategory)
                // // console.log(checkForm(subCategory, form))
                // console.log(subCategory, schema[category][subCategory])
            }

        })
    })

    // console.log(JSON.stringify(schema));
    return schema;
}

const checkForm = (fieldName, indx, form) =>{
    // console.log(form);
    for (field in form){
        if(form[field] != null){
            if (typeof form[field] == 'object' && form[field].length != 0){
               for (let subField in form[field]){
                   if (typeof form[field][subField] == 'object' && form[field][subField].length != 0){
                       if(subField == indx){
                            // console.log(field, subField, indx);
                            for (let subSubField in form[field][subField]){
                                if(fieldName == subSubField)
                                    return form[field][subField][subSubField];
                            }
                        }
                        // Object.keys(form[field][subField]).map((deepSubField, deepSubCatIndx)=>{
                        //     // console.log(fieldName);
                        //     if(fieldName == deepSubField && form[field][subField][deepSubField] != null){
                        //         console.log(fieldName);
                        //         console.log("Field VAlue:    "+ form[field][subField][deepSubField]);
                        //         // return form[field][subField][deepSubField];
                        //         return form[field][subField][deepSubField];
                        //     }
                        // })
                    }else{
                        // console.log(subField + "skfjbhjkhbfqjhe");
                        // console.log(subField + "skfjbhjkhbfqjhe" + form[field][subField]);
                        // if(fieldName == subField){
                        //     return form[field][subField];
                        // } 
                    }
                }
            } 
            else{ 
                if(fieldName == field){
                    // console.log(fieldName, form[field]);
                    return form[field];
                } 
            }
        }
    }
    // return (
    //     Object.keys(form).map((field, catIndx)=>{
    //         if(form[field] != null){
    //             if (typeof form[field] == 'object' && form[field].length != 0){
    //         //     Object.keys(form[field]).map((subField, subCatIndx)=>{
    //         //         if (typeof form[field][subField] == 'object' && form[field][subField].length != 0){
    //         //             Object.keys(form[field][subField]).map((deepSubField, deepSubCatIndx)=>{
    //         //                 // console.log(fieldName);
    //         //                 if(fieldName == deepSubField && form[field][subField][deepSubField] != null){
    //         //                     console.log(fieldName);
    //         //                     console.log("Field VAlue:    "+ form[field][subField][deepSubField]);
    //         //                     // return form[field][subField][deepSubField];
    //         //                     return form[field][subField][deepSubField];
    //         //                 }
    //         //             })
    //         //         }else{
    //         //             console.log(subField + "skfjbhjkhbfqjhe");
    //         //             if(fieldName == subField){
    //         //                 return form[field][subField];
    //         //             } 
    //         //         }
    //         //    })
    //             } 
    //             else{ 
    //                 if(fieldName == field){
    //                     console.log(fieldName, form[field]);
    //                     return "form[field]";
    //                 } 
    //             }
    //         }
        
    //     })
    // )
}

export default FormReview;

const styles = StyleSheet.create({
    container: {
      paddingTop: 20,
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: 10,
      backgroundColor: '#E0E8FC',
    },
    header:{
        color: '#282C50',
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    FormDetailsTileContainer:{
        elevation:3,
        backgroundColor:'white',
        padding:0,
        borderRadius:5,
        margin:10,
        width:620,
        marginHorizontal:'8%',
        alignSelf:'center'
    },
    categoryLabel:{
        fontSize:20,
        backgroundColor:'#282C50',
        color:'white',
        fontWeight:"500",
        paddingHorizontal:5,
    },    
    approveButton: {
        alignItems: 'center',
        backgroundColor: 'green',
        color: '#560909',
        borderColor: 'green',
        paddingRight: 10,
        borderRadius: 10,
        borderWidth: 2,
        width: 180,
        marginHorizontal:10,
        flexDirection:'row',
        justifyContent:'center'
    },
    rejectButton: {
        alignItems: 'center',
        backgroundColor: '#560909',
        color: '#560909',
        borderColor: '#560909',
        padding: 10,
        paddingRight: 15,
        borderRadius: 10,
        borderWidth: 2,
        width: 150,
        marginHorizontal:10,
        flexDirection:'row',
        justifyContent:'center'
    },
});