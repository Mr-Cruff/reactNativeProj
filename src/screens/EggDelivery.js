import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { ActivityIndicator, RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../contexts/Auth';
import { doesFormExist } from '../services/AsyncStorage';
import { defaultFields, executeApiQuery, nth } from '../services/Helpers';
import { MONTH } from '../Constants';
import axios from 'axios';


const EggDelivery =({ route, navigation })=>{
    const {farmSelected}=route.params;
    const {uuid, token} = useAuth().authData;
    const [loading, setLoading] = useState(true);
    const [hed, setHed] = useState("");
    const [sed, setSed] = useState("");
    const [tileVal, setTileVal] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [date, setDate] = useState(new Date());

    useEffect(()=>{
      // console.log(farmSelected.id, new Date());
      getEggData({farmId:farmSelected.id, date}).then((e)=>{setTileVal({...farmSelected, ...e}); setLoading(false);});
    },[]);

    useEffect(()=>{
      console.log(tileVal);
    },[loading]);
    // useEffect(()=>{
    //   console.log("valid submission? "+validSubmission);

    //   if(validSubmission)
    //     submitEggDelivery(val);
    // },[validSubmission]);

    const getEggData = async ({farmId, date=new Date().toJSON()}) =>{
      const url = '/api/EggCollection/getEggTotals';
      const eggData = await executeApiQuery(url, token, "GET", undefined, {farmID:farmId, dateCaptured:date}).catch((err)=>{console.log('err');console.log(err);});
      return eggData.data;
    }

    const validateSubmission = () =>{
      if (!hed||!sed || hed=="" ||sed=="" || hed==0 && sed==0){
        Alert.alert(`Error`, `Please enter a VALID value for Egg Delivery Records`,
        [
          { text: "OK", onPress: () => setLoading(false)}
        ]);
      }else if(hed>tileVal.weekToDate?.eggsOnHand){
      // }else if(tileVal.weekToDate?.eggsOnHand ? hed>tileVal.weekToDate?.eggsOnHand : hed>0){
        Alert.alert(`Warning`, `Hatching Eggs Delivery value is larger than Hatching Eggs on Hand,\nWould you still like to continue submission?`,
        [
          { text: "NO", onPress: () => setLoading(false)},
          { text: "YES", onPress: () =>  submitEggDelivery(farmSelected.id, date)}
        ]);
      // }else if(tileVal.weekToDate?.doubleYolkEggs && tileVal.weekToDate?.rejectEggs? sed>tileVal.weekToDate?.doubleYolkEggs + tileVal.weekToDate?.rejectEggs : sed>0){
      }else if(sed>tileVal.weekToDate?.doubleYolkEggs + tileVal.weekToDate?.rejectEggs){
        Alert.alert(`Warning`, `Salable Reject Eggs Delivery value is larger than Reject and Double-yolked Eggs collected,\nWould you still like to continue submission?`,
        [
          { text: "NO", onPress: () => setLoading(false)},
          { text: "YES", onPress: () =>  submitEggDelivery(farmSelected.id, date)}
        ]);
      }else
        submitEggDelivery(farmSelected.id, date);
    } 

    const submitEggDelivery = async (farmId, date=new Date()) => {
      const eggsDelivered=hed;
      const salableEggsDelivered=sed;
      const url = '/api/EggDelivered/submitEggDeliveryDetails';

      const eggData = await executeApiQuery(url, token, "POST", {"Farm":farmId, "Hatching Eggs Delivered":eggsDelivered, "Salable Eggs Delivered":salableEggsDelivered, "Date Captured":date}, undefined)
        .catch((err)=>{console.log('err');console.log(err);});
        if(eggData.status){
          setLoading(eggData.status?false:true);
          if(eggData.status == 200){
            Alert.alert(`Success`,`Egg delivery record was submitted sucessfully.`, [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { 
                text: "OK", 
                onPress: () => {navigation.goBack(); navigation.goBack();}
             }
            ]);
          }else{
            Alert.alert(`Failed`,`Egg delivery record submission failed.\nError: ${eggData.status}.`, [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { 
                text: "OK", 
                onPress: () => {navigation.goBack();}
             }
            ]);
          }
      }
    }

    const handleChange = (e) => {
      const regex = /^[0-9\b]+$/;
      if (e === "" || regex.test(e))
        setHed(e);
    };

    const handleChange1 = (e) => {
        const regex = /^[0-9\b]+$/;
        if (e === "" || regex.test(e))
          setSed(e);
    };

    const RenderTile = () => {
      return(
        <View style={{backgroundColor:'#f9f4f8'}}>
          <View style={{backgroundColor:'#592216',alignItems:'center',}}>
            <Text style={{fontSize: 24, fontWeight:'bold', color:'white'}}>{tileVal.name}</Text>
          </View>
          <View style={{marginHorizontal:20, flexDirection:'column',justifyContent:'space-evenly'}}>
            <View style={{marginBottom:10}}>
              <View style={{marginHorizontal:-20, backgroundColor:'#164d59', alignItems:'center'}}>
                <Text style={{fontSize: 20, fontWeight:'medium', color:'#bfe7ef'}}>WEEK TO DATE</Text>
              </View>
              <RenderLabelValue label={"Eggs Brought Forward"} value={tileVal.weekToDate?.eggBroughtForward} />
              <RenderLabelValue label={"Eggs Delivered"} value={tileVal.weekToDate?.hatchingEggsDelivered} />
              <RenderLabelValue label={"Eggs On-Hand"} value={tileVal.weekToDate?.eggsOnHand} />
              <RenderLabelValue label={"Hatching Eggs"} value={tileVal.weekToDate?.hatchingEggs} />
              <RenderLabelValue label={"Reject Eggs"} value={tileVal.weekToDate?.rejectEggs} />
              <RenderLabelValue label={"Double Yolk Eggs"} value={tileVal.weekToDate?.doubleYolkEggs} />
              <RenderLabelValue label={"Salable Eggs"} value={tileVal.weekToDate?.doubleYolkEggs + tileVal.weekToDate?.rejectEggs || "Unable to calculate"} />
              <RenderLabelValue label={"Dump Eggs"} value={tileVal.weekToDate?.dumpEggs} />
              <RenderLabelValue label={"Total Eggs Produced"} value={tileVal.weekToDate?.totalEggsProduced} />
            </View>

            <View style={{marginBottom:10}}>
              <View style={{marginHorizontal:-20, backgroundColor:'#164d59', alignItems:'center'}}>
                <Text style={{fontSize: 20, fontWeight:'medium', color:'#bfe7ef'}}>EGG TOTALS TO DATE</Text>
              </View>
              <RenderLabelValue label={"Eggs Delivered"} value={tileVal.totalToDate?.totalHatchingEggsDelivered} />
              <RenderLabelValue label={"Eggs Produced"} value={tileVal.totalToDate?.totalEggsProduced} />
              <RenderLabelValue label={"Hatching Eggs"} value={tileVal.totalToDate?.totalHatchingEggs} />
              <Text></Text>
              <RenderLabelValue label={"Double yolked Eggs"} value={tileVal.totalToDate?.totalDoubleYolkEggs} />
              <RenderLabelValue label={"Reject Eggs"} value={tileVal.totalToDate?.totalRejectEggs} />
              <RenderLabelValue label={"Dump Eggs"} value={tileVal.totalToDate?.totalDumpEggs} />
            </View>
          </View>
        </View>
      );
    }

    const RenderLabelValue = ({label, value}) => {
      return (
        <View style={{flexDirection:'row', margin:5}}>
          <Text style={{fontSize: 17}}>{label}: </Text>
          <Text style={{fontSize: 17, fontWeight: 'bold', color: 'black',}}>{
          Number(value) || <View style={{
                                  color: '#282C50',
                                  fontWeight: 'bold',
                                  backgroundColor: "#dfdfdf",
                                  borderRadius: 20,
                                  paddingHorizontal: 15,
                      }}><Text style={{color: 'grey',fontSize: 17, fontWeight: 'bold'}}>NOT FOUND</Text>
                      </View>
                      }
                    </Text>
        </View>
      );
    }

    const setMinDate = () =>{
      var date = new Date();
      var firstDay= date.getDate() - date.getDay()
      var minDate= new Date(date.setDate(firstDay))
      return minDate;
    }

    return(
        <ScrollView  style={styles.container}>
            <Text style={styles.pageTitle}>EGG DELIVERY</Text>
            {!loading?
                <View>
                  <Text style={{color:'#282C50',fontSize: 24, fontWeight:'bold'}} >RECORD EGG DELIVERY</Text>
                  <TouchableOpacity style={{maxWidth:250}} onPress={()=>setIsVisible(true)}>
                      <Text style={{backgroundColor:'beige', padding:10, maxWidth:250, fontSize:17, color:'black',borderTopLeftRadius:10, borderTopRightRadius:10, elevation:5}}>Date:   {date.toDateString()}</Text>
                      {
                        isVisible &&
                        <DateTimePicker 
                          value={date} 
                          minimumDate={setMinDate()}
                          maximumDate={new Date()}  
                          onChange={(event, selectedDate)=>{
                            setIsVisible(false);
                            setDate(selectedDate);
                            }
                          } 
                         //  onCancel={() =>{setIsVisible(false)}}
                          mode="date"
                        />
                      }
                  </TouchableOpacity>
                  <View style={{height:250, marginBottom:20}}>
                    {/* <TextInput style={[styles.input,{flex:2},{ borderColor:'amber', borderWidth:2}]} */}
                    <TextInput style={[styles.input,{flex:1}]}
                      placeholder="Hatching Eggs Delivered"
                      keyboardType="numeric"
                      numeric
                      value={hed}
                      maxLength={10}
                      onChangeText={(e)=>handleChange(e)}
                    />
                    <TextInput style={[styles.input,{flex:1, marginTop:10}]}
                      placeholder="Salable Reject Eggs Delivered"
                      keyboardType="numeric"
                      numeric
                      value={sed}
                      maxLength={10}
                      onChangeText={(e)=>handleChange1(e)}
                    />
                    <TouchableOpacity style={[styles.button,{flex:0.7, marginTop:20, marginLeft:5, height:'auto', justifyContent:'center'}]} onPress={()=>{validateSubmission()}}>
                    {/* <TouchableOpacity style={[styles.button,{flex:1, marginLeft:5, height:'100%'}]} onPress={()=>{setLoading(true);submitEggDelivery(farmSelected.id, date)}}> */}
                        <Text style={{color:'white', alignSelf:'center', fontSize:18}} >Submit Delivery Record</Text>
                    </TouchableOpacity>
                  </View>
                  <RenderTile />
                </View>
                :
                <View style={{alignItems:'center'}}>
                  <ActivityIndicator size="large" />
                  <Text> Loading . . . </Text>
                </View>
            }
        </ScrollView>
    )
}

export default EggDelivery;


const styles = StyleSheet.create({
    container: {
      paddingTop: 20,
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: 10,
      backgroundColor: '#E0E8FC',
    },
    pageTitle:{
        color: '#282C50',
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 30,
      },
    button: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: '#282C50',
      padding: 10,
      borderRadius: 5,
      width: 300,
    },
    input: {
      color: '#282C50',
      backgroundColor: 'white',
      height: 50,
      borderWidth: 0,
      borderRadius: 2,
      fontSize: 16,
      minWidth: 150,
    },
  });