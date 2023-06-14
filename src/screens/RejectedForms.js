import React, {useEffect, useState} from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  ActivityIndicator,
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAuth} from '../contexts/Auth';
import axios from 'axios';
import { APP_API } from '../Constants';
import EditRejectedForm from './EditRejectedForm';
import { getFarmFromAsync } from '../services/AsyncStorage';


const RejectedForms = ({route, navigation, back}) => {
    const auth = useAuth();
    const isFocused = useIsFocused();

    let farms = [];Object.keys(route.params).map((item, index) => {farms.push(route.params[item])});farms.sort((a, b) =>{let fa = a.name.toLowerCase(),fb = b.name.toLowerCase();if (fa < fb) {return -1;}if (fa > fb) {return 1;}return 0;});
    const [farmSelected, setFarmSelected] = useState('none');
    const [formList, setFormList] = useState([]);
    const [loading, setLoading] = useState(true);
    const size = Object.keys(farms).length;

    useEffect(() => {
      // setLoading(true);
      size === 1 ?(()=>{setFarmSelected(farms[0]);getForms(farms[0].id).then(setLoading(false)) })(): "none";
      if (isFocused)
        farmSelected != 'none' ? getForms(farmSelected.id).then(setLoading(false)):setLoading(false); 
    }, []);

    useEffect(() => {
      setLoading(true);
      size === 1 ? setFarmSelected(farms[0]) : "none";
      if (isFocused)
        farmSelected != 'none' ? getForms(farmSelected.id).then(setLoading(false)):setLoading(false); 
    }, [isFocused]);

    useEffect(() => {
        if (
          farmSelected != 'none'
        ) {
          setLoading(true);
          // console.log(farmSelected);
          getForms(farmSelected.id).then(()=>{setLoading(false)});
          // setLoading(false);
          // FormsList(tempData);
        }
    },[farmSelected]);

    const FarmSelect = () => {
        if (size > 1) {
          return (
            <View>
  
            <View style={{flexDirection:'row', alignItems:'center' ,justifyContent:'space-between'}}>
              <Text
                style={styles.pickerLabel}>{(farmSelected != 'none') ? 'Farm Selected:': 'Select a Farm:'}
              </Text>        
              <Picker
                style={{backgroundColor: 'white', color:farmSelected=='none'? 'grey':'black', height: 60, width:'80%'}}
                selectedValue={farmSelected}
                onValueChange={(selected, selectedIndex) => (()=>{setFarmSelected(selected)})()}>
                <Picker.Item label="None" value="none" key={'none'} />
                {
                  farms.map((farm, index) => {
                    return <Picker.Item label={farm.name} value={farm} key={index} />
                  })
                }
              </Picker>       
            </View>
            <Text style={{marginTop:10, color:'#adb5bd', textAlign:'center'}}>{(farmSelected != 'none') ? '': 'Select a Farm from the picker ABOVE to see form for REVIEW'}</Text>
            </View>
          );
        } 
    };

    //   Check if this works ***********
    const SingleFarm = () => {
        return <Text style={{fontSize:24, fontWeight:'bold', color:'#282C50'}}>{farms[0].name}</Text>;
    }
    
    const onClick = async (item) => {
        setLoading(true);
        // console.log(item);
        // console.log(form);
        // const reviewPage = {
        //     farm: farmSelected,    
        // }
        // console.log(farmSelected);
        await getForm(item.formId).then((e)=>{
          navigation.navigate("Edit Rejected Form", {retrievedForm:e.Data, reasons:e.RejectReasons, farm:farmSelected
          })
        })
        // await getForm(item.formId).then((e)=>{console.log(e);navigation.navigate("Edit Rejected Form", {retrievedForm:e.Data, reasons:e.RejectReasons})})
        // await getForm(item.formId).then((e)=>{navigation.navigate('Form Review', {farm:farmSelected, house:item.house, form:e, createdBy:item.createdBy})})
        // navigation.navigate('General Form', form);
  
    }

    const Loading = () => {
        return(
            <View><ActivityIndicator size="large" color="red" /><Text style={{marginTop:5,alignSelf:'center'}}>Loading, Please wait... </Text></View>
        );
    }

    const getForms = async (farmId)=>{
        const config = {
            headers:{
              'Content-Type': 'application/json',
              Authorization: 'bearer ' + auth.authData.token
            },
            params: { 
              farmId: farmId 
            } 
        }
        return await axios.get("https://devipbformdata.jabgl.com:84/api/FormDetails/getformdetailsSubmittedByFarm",config).then((response)=>{
          // console.log(JSON.stringify(response.data[0]["TblFlockMt"]));
          // console.log(JSON.stringify(formInfo(response.data[0]["TblFlockMt"])));
          // console.log(response.status);
        //   console.log((response.data[0]["TblFlockMt"][0]));
          setFormList(formInfo(response.data[0]["TblFlockMt"]))
        }).catch(err => console.warn(err)) 
    }

    const getForm = async (formId)=>{
        const config = {
            headers:{
              'Content-Type': 'application/text/plain',
              Authorization: 'bearer ' + auth.authData.token
            },params: { formId: formId } 
        }
        return await axios.get(`${APP_API}/api/FormDetails/GetSubmittedFormByFormID`,config).then((response)=>{setLoading(false); return response.data}) 
    }

    const FormTile = ({ formObj }) => {
        const { createdBy, dateCreated, formId, statusId} = formObj;
        return(
            <TouchableOpacity 
            //   key={formId}
              onPress={() => {onClick(formObj)}} 
              style={{flexDirection:'row', paddingVertical:10, backgroundColor:'white', justifyContent:'space-between', paddingHorizontal:10, marginBottom:2}}
              >
                {/* <Text>{house}</Text> */}
                {/* <Text>Form ID: {formId}</Text> */}
                <Text style={{fontSize:15, color:'#ced4da'}}>Submitted By: <Text style={{fontWeight:'400', fontSize:16, color:'grey'}}>{createdBy}</Text></Text>
                <Text style={{fontSize:15, color:'#ced4da'}}>Date Submitted:  <Text style={{fontWeight:'400', fontSize:16, color:'grey'}}>{new Date(dateCreated).toDateString()}</Text></Text>
            </TouchableOpacity>
        )
    }

    const FormsList = (forms) => {
        // console.log(JSON.stringify(forms));
        return(
            <View style={{marginTop:20}}>
                <Text style={{fontSize:20, fontWeight:'bold', padding:0, color:'#343a40'}}>{farmSelected.name}</Text>
                  {forms.map((form, formIndex) => { 
                      return (
                        <View style={{marginBottom:10}} key={formIndex}>
                          <Text style={{fontSize:17, marginTop:0, marginBottom:5, color:'#495057'}}>{form.house.toUpperCase()}</Text>
                          <View>
                            {
                              form.forms.length > 0 ?                             
                                form.forms.map((i, idx)=>{
                                    return <FormTile formObj={{house: form.house.toUpperCase(), ...i}}  key={idx}/>
                                })
                              :<Text style={{fontSize:15, color:'#adb5bd', backgroundColor:'#dee2e6', width:'100%', textAlign:'center', textAlignVertical:'center', height:40}}>No REJECTED forms available for REVIEW for this house</Text>
                            }
                          </View>
                        </View>);
                  })}
            </View>
        )
    }

    return (
        <View style={styles.container}>
          <Text
            style={styles.header}>
            FARM SELECT
          </Text>
          <ScrollView>
            {   
                !loading? 
                    <View>
                        <View>{farms.length != 1 && <FarmSelect />}</View>
                        <View>{farmSelected != 'none'? FormsList(formList):''}</View>
                    </View>
                    :<Loading />
            }
          </ScrollView>
        </View>
      );
}

export default RejectedForms;

const formInfo = (arrForms) => {
  let formData = [];
  for (let houseObj of arrForms){
    if(houseObj["HouseNo"].trim() !=""){
      const house = `House ${houseObj["HouseNo"].trim()}`
      let formDetails = {house:house, forms:[]}

      for (let form of houseObj["TblFlockDetails"]){
        // create form details object
        // console.log(form);
        if(form.StatusId == 3){
            const formDet = {
                formId:form.FormId,
                dateCreated:form.DateCreated,
                createdBy: form.CreatedByName,
                // statusId: form.StatusId,
            }
            // add form details object to forms array
            formDetails.forms.push(formDet);
        }
      }
    
      // Sort forms by date created
      formDetails.forms.sort((a,b)=>{
        return new Date(b.dateCreated) - new Date(a.DateCreated);
      });
    
      // return complete form object to forms array
      formData.push(formDetails);
    }
  }
  //Sorts formData by house number
  formData.sort((a,b)=> a.house.localeCompare(b.house));
  return formData;
};

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
        marginBottom: 30,
    },
    pickerLabel:{
        color:'black',
        fontSize: 20,
        paddingLeft: 10,
        padding: 10,
    },
  });