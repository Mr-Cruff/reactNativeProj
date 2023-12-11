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
import { useAuth } from '../contexts/Auth';
import axios from 'axios';
import { categoryParse, executeApiQuery, organizeFormFields, ShowAlert, timeConvert, timeConverter, WhitePlus, WhiteTick, WhiteX } from '../services/Helpers';
import { APP_API, FORM_STATUS_OBJ } from '../Constants';
import LinearGradient from 'react-native-linear-gradient';

const FormReview = ({ route, navigation }) => {
    const auth = useAuth();
    // const rejectingForm = useRef();
    // const rejectPage = useRef();
    // const [loading, setLoading] = useState(true);
    const [reject, setReject] = useState(false);
    const { Data } = route.params.recievedData;
    // console.log(Data);
    const sturctedForm = organizeFormFields(Data);
    console.log("============================ Form Review Refactored =======================");
    console.log(sturctedForm);
    console.log("============================ ====================== =======================");

    const FormDetailsTile = ({ header }) =>{
        const {Farm:farm, House:house, ["Date Created"]:dateCreated, ["Date Submitted"]:dateSubmitted,["Created By"]:createdBy} = header;
        const status = (()=>{const x=JSON.parse(Data); return x.Status})();
        return(
            <View style={styles.FormDetailsTileContainer}>
                <View style={{flexDirection:'row', justifyContent:'center', backgroundColor:'#73ba9b', padding:5, borderTopLeftRadius:5, borderTopRightRadius:5,}}>
                    <Text style={{color:'#282C50', fontSize:20, fontWeight:'500', paddingHorizontal:10}}>{farm}</Text>
                    <Text style={{color:'black', fontSize:20, fontWeight:'300'}}>-</Text>
                    <Text style={{color:'#282C50', fontSize:20, fontWeight:'500',paddingHorizontal:10}}>{house.toUpperCase()}</Text>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-around', paddingVertical:10,marginBottom:5}}>
                    <View>
                        {/* {console.log(form)} */}
                        <Text>Created By: {InnerText(createdBy)}</Text>
                        <Text>Date Created: {InnerText(new Date(dateCreated).toDateString())}</Text>
                    </View>
                    <View>
                        <Text>Date Submitted: {typeof dateSubmitted == "undefined"?InnerText("No Date Found") :InnerText(new Date(dateSubmitted).toDateString()) }</Text>
                        <Text>Status: {InnerText(status)}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const InnerText = (text) => {
        return <Text style={{fontWeight:'600', fontStyle:'italic', color:'black', fontSize:16 }}>{text}</Text>
    }

    // useEffect(()=>{
    //     if (reject){
    //         rejectPage.current.scrollToEnd({ animated: true })
    //         // if(rejectingForm && rejectingForm.current) {
    //     //         const reactTag = findNodeHandle(rejectingForm.current);
    //     //     if (reactTag) {
    //     //       AccessibilityInfo.setAccessibilityFocus(reactTag);
    //     //     }
    //         // rejectingForm.current.focus();
    //     //  }
    //  }
    // },[reject]);
    return( 
        // <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={["#FFEBBC","#FFBEF9","#9EAFFF"]} style={styles.container}>
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}}  colors={["#edf2fb","#ccdbfd",]} style={styles.container}> 
            <Text style={styles.header}>FORM REVIEW</Text>
            <FormDetailsTile header={sturctedForm.header}/>
            <ScrollView style={styles.scrollView}>
            <View style={{backgroundColor:'white', paddingHorizontal:10,}}>
                {Object.keys(sturctedForm.categories).map((key, idx)=>{
                    // console.log(key);
                    return(
                        <View>
                            <Text style={styles.categoryLabel}>{key}</Text>
                            {categoryParse(sturctedForm.categories[key])}
                        </View>
                    )
                })}
            </View>
            </ScrollView>
            {reject && <RejectMenu navigation={navigation} id={sturctedForm.header["Form Id"]} setReject={setReject} />}
            {!reject &&<View style={{flexDirection:'row', justifyContent:'space-evenly', paddingVertical:10, backgroundColor:"white",borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                <TouchableOpacity style={styles.approveButton} onPress={() => approveButton(sturctedForm.header["Form Id"], auth, navigation)}><WhiteTick size={50} /><Text style={{color:'white', fontWeight:'600', fontSize:20, marginLeft:20}}>APPROVE</Text></TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => rejectButton(setReject)}><WhiteX size={40}/><Text style={{color:'white', fontWeight:'600', fontSize:20, marginLeft:20}}>REJECT</Text></TouchableOpacity>
            </View>}
        </LinearGradient>
    );
}

const RejectMenu = ({ id, navigation, setReject }) => {
    const [reasons, setReasons] = useState(['']);
    const [isEmpty, setIsEmpty] = useState(true);
    const auth = useAuth();

    return(
        <View style={{backgroundColor:'#fbe9ea', borderRadius:10,}}>
            <View style={{backgroundColor:'#81171b', flexDirection:'row',justifyContent:'space-between', elevation:1,}}>
                <Text style={{color:'white', fontSize:20, fontWeight:'bold', paddingHorizontal:10,}}>Rejection Reasons</Text>
                <TouchableOpacity style={{alignSelf:'center', marginRight:"0.5%"}} onPress={()=>setReject(false)}><WhiteX size={20}/></TouchableOpacity>
            </View>
            {reasons.map((reason, indx)=>
                <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, backgroundColor:indx%2==0?'#f9ddde':""}} key={indx}>
                    <Text>{indx+1}. </Text>
                    <TextInput placeholder="Enter Reason here" onChangeText={text => {text == ""? setIsEmpty(true):setIsEmpty(false); reasons[indx]=text}}>{reason}</TextInput>
                </View>)}
                <View style={{flexDirection:'row', backgroundColor:'#f9ddde', justifyContent:'center', padding:10,}}>
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
    const { token, name } = auth.authData;
    //Make Rejection Query Here *************
    
    // await axios.patch(`${APP_API}/api/FormDetails/formID?formId=${formId}`, {statusId:3, approverComments:[...reasons]}, config)
    executeApiQuery(`/api/FormDetails/formID?formId=${formId}`,token,'patch',{statusId:FORM_STATUS_OBJ["Rejected"], approverComments:[...reasons], rejectedBy:name},undefined)
    .then(function ({ response }) {
      if(response.status == 200 ) {
        ShowAlert(`Success`, ("Form review submitted successfully" || "NO Error Code Found"),[{text: "Cancel", style: "cancel"},{text: "OK", onPress: () => nav.goBack() }]);
      }else{
        ShowAlert(`Failed - ${response.status}`, `${response.data.message|| "NO Error Code Found"}`);
      }
    }).catch((err)=>{
        Alert.alert(
        'Failed',
        `ERROR: ${err.message}`, // <- this part is optional, you can pass an empty string
        )
    });
}

const approveForm = async (formId, auth, nav) => { 
    const { token, name } = auth.authData;
    executeApiQuery(`/api/FormDetails/formID?formId=${formId}`,token,'patch',{statusId:2, approverComments:["Approved"], approvedBy:name},undefined)
    .then(function ({ response }) {
    //   console.log("================================== Response ===============================");
    //   console.log(response.data);
    //   console.log("============================ ====================== =======================");
      if(response.status == 200 ) {
        ShowAlert(`Success`, ("Form review submitted successfully" || "NO Error Code Found"),[{text: "Cancel", style: "cancel"},{text: "OK", onPress: () => nav.goBack() }]);
      }else{
        ShowAlert(`Failed - ${response.status}`, `${response.data.message|| "NO Error Code Found"}`);
      }
    }).catch((err)=>{
        Alert.alert(
        'Failed',
        `ERROR: ${err.message}`, // <- this part is optional, you can pass an empty string
        )
    });
}

export default FormReview;

const styles = StyleSheet.create({
    container: {
      paddingVertical: 20,
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: '15%',
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
        width:'100%',
        marginHorizontal:'18%',
        alignSelf:'center'
    },
    categoryLabel:{
        fontSize:24,
        backgroundColor:'#282C50',
        color:'white',
        fontWeight:"500",
        paddingHorizontal:10,
        marginHorizontal:-10,
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
    scrollView:{
        // borderTopLeftRadius:20
        // marginBottom:'2%',
    }
});