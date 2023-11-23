/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl
} from 'react-native';
import {useAuth} from '../contexts/Auth';
import Header from '../components/Header';
import {FarmTile} from '../components/Dashboard';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { APP_API } from '../Constants.tsx';
import ResetPassword from './ResetPassword';
import { APP_ROLES, WEEKDAY } from '../Constants';
import LinearGradient from 'react-native-linear-gradient';
import { NewFormIcon, EditFormIcon, WhiteTick, WhiteX, UserProfileIcon, ClockIcon, timeConvert, CalnderIcon, jamaicanDateFormat, executeQuery, getFarmsFromGlobalByName } from '../services/Helpers';
import { GlobalContext } from '../contexts/GlobalContext';
import { doesFormExist, getAllFormIds, getAllForms, getFarmFromAsync, getFarmsFromAsync, storeFarms } from '../services/AsyncStorage';
import { Button } from 'react-native-paper';
import { postQuery } from '../services/Helpers';
import { Loading } from '../components/Loading';
//Mock Form MetaData
const formFields = [
  {
    title: 'Culls & Mortality',
    type: 'common',
    fields: [
        {label: 'Culls - Male', type: 'int', regex:{min:0, max:100,isRequired:true}, farmType:'common'},
        {label: 'Mortality - Male', type: 'int', regex:{min:0, max:100,isRequired:true}, farmType:'common'},
        {label: 'Dead on Arrival - Male', type: 'int', regex:{min:0, max:100,isRequired:false}, farmType:'grow'},
        {label: 'Culls - Female', type: 'int', regex:{min:0, max:100,isRequired:true}, farmType:'common'},
        {label: 'Mortality - Female', type: 'int', regex:{min:0, max:100,isRequired:true}, farmType:'common'},
        {label: 'Dead on Arrival - Female', type: 'int', regex:{min:0, max:100,isRequired:false}, farmType:'grow'},
    ],
  },
  {
    title: 'Feed Inventory',
    type: 'common',
    fields: [
        //Feed Inventory
        {label: 'Feed Brought Forward (lbs)', type: 'float', regex:{min:0, max:60000,isRequired:true}, farmType:'common'},
        // {label: 'Feed Recieved (lbs)', type: 'float', regex:{min:0, max:null,isRequired:true}, farmType:'common'},
        {label: 'Feed Transferred (lbs)', type: 'float', regex:{min:0, max:50000,isRequired:false}, farmType:'common'},
        {label: 'Feed Spoilage (lbs)', type: 'float', regex:{min:0, max:50000,isRequired:false}, farmType:'common'},
        // {label: 'Days in Inventory', type: 'float', regex:{min:0, max:null,isRequired:false}, farmType:'common'},
        //Feed Consumed
        {label: 'Feed Start Time', type: 'time', regex:{isRequired:true}, farmType:'common'},
        {label: 'Feed Consumption Time', type: 'justTime', regex:{isRequired:true},farmType:'common'},
        {label: 'Feed Consumed (lbs) - Male', type: 'float', regex:{min:0, max:600,isRequired:true},farmType:'common'}, //Conditional fields based on gender
        {label: 'Feed Consumed (lbs) - Female', type: 'float', regex:{min:0, max:3000,isRequired:true},farmType:'common'}, //Conditional fields based on gender
        {label: 'Feed Distribution - Male', type: 'option', options: ['GOOD','POOR'], regex:{min:0, max:null,isRequired:true},farmType:'common'},
        {label: 'Feed Distribution - Female', type: 'option', options: ['GOOD','POOR'], regex:{min:0, max:null,isRequired:true},farmType:'common'},
    ],
  },
  {
    title: 'Miscellaneous',
    type: 'common',
    fields: [
      {label: 'Water Consumption (gal)', type: 'float', regex:{min:0.001, max:null, isRequired:true}, farmType:'common'},
      {label: 'All Clocks on Time', type: 'option', options: ['YES','NO'], regex:{isRequired:true}, farmType:'common'},
      {label: 'Lights', type: 'multi-time-only', farmType:'common', regex:{isRequired:true}, 
      fields: [{label: 'ON Time', type: 'time', regex:{isRequired:true, label:"LIGHT ON"}, farmType:'common'}, {label: 'OFF Time', type: 'time', regex:{isRequired:true, label:"LIGHT OFF"}, farmType:'common'}]},
      {label: 'Lighting Hours', type: 'float', regex:{min:0, max:24, isRequired:true}, farmType:'common'}, // OFF time - On time
      // {label: 'Morning Temperature', type: 'time', type: 'float', view:'value-time', regex:{isRequired:true}, farmType:'common'},
      // {label: 'Afternoon Temperature', type: 'time', view:'value-time', regex:{isRequired:true}, farmType:'common'},
      {
        label: 'Temperature',
        type: 'time',
        farmType:'common',
        fields: [
          {label: 'Morning Entry', type: 'float', view:'value-time', regex:{isRequired:true}},
          {label: 'Afternoon Entry', type: 'float', view:'value-time', regex:{isRequired:true}},
        ]
      },
      {label: 'Observation/Comments', type: 'description', regex:{isRequired:false}, farmType:'common'},
    ],
  },
  {
    title: 'Birds',
    type: 'common',
    fields: [
      {label: 'Bird Weight (grams) - Male', type: 'float', regex:{min:0, max:6000, isRequired:false}, farmType:'common'},
      {label: 'Bird Weight (grams) - Female', type: 'float', regex:{min:0, max:6000, isRequired:false}, farmType:'common'},
      {label: 'Uniformity (%) - Male', type: 'float', regex:{min:0, max:100, isRequired:false}, farmType:'common'},
      {label: 'Uniformity (%) - Female', type: 'float', regex:{min:0, max:100, isRequired:false}, farmType:'common'},
      {label: 'Birds Added - Male', type: 'int', regex:{min:0, max:null, isRequired:false}, farmType:'common'},
      {label: 'Birds Added - Female', type: 'int', regex:{min:0, max:null, isRequired:false}, farmType:'common'},
      {label: 'Number of Birds Weighed - Male', type: 'int', regex:{min:0, max:null, isRequired:false}, farmType:'common'},
      {label: 'Number of Birds Weighed - Female', type: 'int', regex:{min:0, max:null, isRequired:false}, farmType:'common'},
    ],
  },
  {
      title: 'Eggs',
      type: 'production',
      fields: [
          {
            label: 'Hatching Eggs', 
            type: 'multi-field', 
            fields: [
              {label: 'Hatching 1st Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Hatching 2nd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Hatching 3rd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Hatching 4th Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
            ],
          },
          {
            label: 'Reject Eggs', 
            type: 'multi-field', 
            fields: [
              {label: 'Rejects 1st Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Rejects 2nd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Rejects 3rd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Rejects 4th Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
            ],
          },
          {
            label: 'Dumps', 
            type: 'multi-field', 
            fields: [
              {label: 'Dumps 1st Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Dumps 2nd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Dumps 3rd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Dumps 4th Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
            ],
          },
          {
            label: 'Double Yolked Eggs', 
            type: 'multi-field', 
            fields: [
              {label: 'Double Yolked 1st Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Double Yolked 2nd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Double Yolked 3rd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              {label: 'Double Yolked 4th Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
            ],
          },
          // {label: 'Eggs Delivered', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
          {label: 'Gross Egg Weight (grams)', type: 'float', regex:{min:0.001, max:null, isRequired:true},farmType:'production'},
          {label: 'Average Egg Weight (grams)', type: 'float', regex:{min:0.001, max:null, isRequired:true},farmType:'production'},
          {label: 'Number of Eggs Weighed', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
          {
            label: 'Egg Room Temperature',
            type: 'time',
            farmType:'common',
            fields: [
              {label: 'Egg Room 1st Entry', type: 'float', view:'value-time', regex:{isRequired:false},farmType:'production'},
              {label: 'Egg Room 2nd Entry', type: 'float', view:'value-time', regex:{isRequired:false},farmType:'production'},
            ]
          },
          // {
          //   label: 'Egg Room Temp (Dry)',
          //   type: 'time',
          //   fields: [
          //     {label: 'Egg Dry 1st Entry', type: 'float', view:'value-time'},//Egg Room Temp - Entry 1 & 2
          //     {label: 'Egg Dry 2nd Entry', type: 'float', view:'value-time'}
          //   ]
          // },
          {label: 'Egg Room Humidity (%)', type: 'float', regex:{min:0, max:100, isRequired:true},farmType:'production'},
      ],
  },
  {
      title: 'Vaccination',
      type: 'grow',
      fields: [
        {label: 'Type/Description', type: 'string', regex:{isRequired:false},farmType:'grow'},
        {label: 'Quantity', type: 'float', regex:{min:0, max:null,isRequired:false},farmType:'grow'},
        {label: 'Serial Number', type: 'string', regex:{isRequired:false},farmType:'grow'},
      ],
  },
];

// import NewForm from './NewForm';
// import {SubFields} from '../components/SubFieldTally';
// import Culls from '../components/formComponents/EditFormCategory';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import EditFormDetails from './EditFormDetails';
// import EditFormSelect from './EditFormSelect';


// const farms = [
//   {
//     name: 'Farm 4',
//     type: 'Production',
//     house: 'House 1',
//     id: '2',
//     flockNumber: '34',
//     birdsOverhead: '534',
//     BirdsBroughtForward: {
//       male: '872',
//       female: '2234',
//     },
//     males: '567',
//     females: '2341',
//     age: '34',
//   },
//   {
//     name: 'Farm 4',
//     type: 'Production',
//     house: 'House 1',
//     id: '2',
//     flockNumber: '34',
//     birdsOverhead: '534',
//     BirdsBroughtForward: {
//       male: '872',
//       female: '2234',
//     },
//     males: '567',
//     females: '2341',
//     age: '34',
//   },
//   {
//     name: 'Farm 4',
//     type: 'Production',
//     house: 'House 1',
//     id: '2',
//     flockNumber: '34',
//     birdsOverhead: '534',
//     BirdsBroughtForward: {
//       male: '872',
//       female: '2234',
//     },
//     males: '567',
//     females: '2341',
//     age: '34',
//   },
//   {
//     name: 'Farm 5',
//     type: 'Grow',
//     house: 'House 1',
//     id: '2',
//     flockNumber: '18',
//     birdsOverhead: '364',
//     BirdsBroughtForward: {
//       male: '642',
//       female: '1334',
//     },
//     males: '567',
//     females: '2341',
//     age: '19',
//   },
//   {
//     name: 'Farm 5',
//     type: 'Grow',
//     house: 'House 1',
//     id: '2',
//     flockNumber: '18',
//     birdsOverhead: '364',
//     BirdsBroughtForward: {
//       male: '642',
//       female: '1334',
//     },
//     males: '567',
//     females: '2341',
//     age: '19',
//   },
// ];

//HOME SCREEN
const Home = ({navigation, back}) => {
  // Rerender home page on screen changes
  const [netInfo, setNetInfo] = useState(null);
  const [farms, setFarms] = useState(undefined);
  // const [houses, setHouses] = useState([]);
  const auth = useAuth();
  // console.log(auth.authData);
  const { role, firstLogon, name, email, uuid } = useAuth().authData;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const global = useContext(GlobalContext);
  const pkg = require('../../package.json');

  // Buttons
  // Move buttons to another file
  const signOut = () => {
    auth.signOut();
  };

  const RoundButtonNew =({ path, farms,props })=>{
    return (
      <TouchableOpacity style={{width:100, margin:10}} onPress= {()=> navigation.navigate(path, {farms})}>
          <LinearGradient colors={['#5c9ead', '#326273']} style={{height:100, width:100, padding:10, alignItems:'center',justifyContent:'center', borderRadius:60,}}>
            <NewFormIcon size={58} />
          </LinearGradient>
        <Text style={{textAlign:'center', color:'#282C50', fontSize:16, fontWeight:"400"}}>{props.label}</Text>
      </TouchableOpacity>
    )
  }
  const RoundButtonEdit =({ path, farms,props })=>{
    return (
      <TouchableOpacity style={{width:100, margin:10}} onPress= {()=> navigation.navigate(path, {farms:farms, reviewType:'submission'})}>
          <LinearGradient colors={['#fec89a', '#ef8354']} style={{height:100, width:100, padding:10, alignItems:'center',justifyContent:'center', borderRadius:50,}}>
            <EditFormIcon size={54} />
          </LinearGradient>
        <Text style={{textAlign:'center', color:'#282C50', fontSize:16, fontWeight:"400"}}>{props.label}</Text>
      </TouchableOpacity>
    )
  }
  const RoundButtonTick =({ path, farms,props })=>{
    return (
      <TouchableOpacity style={{width:100, margin:10}} onPress= {()=> navigation.navigate(path, {farms:farms, reviewType:'review'})}>
          <LinearGradient colors={['#3a6ea5','#004e98']} style={{height:100, width:100, padding:10, alignItems:'center',justifyContent:'center', borderRadius:60,}}>
            <WhiteTick size={54} />
          </LinearGradient>
        <Text style={{textAlign:'center', color:'#282C50', fontSize:16, fontWeight:"400"}}>{props.label}</Text>
      </TouchableOpacity>
    )
  }
  const RoundButtonX =({ path, farms,props })=>{
    return (
      <TouchableOpacity style={{width:100, margin:10}} onPress= {()=> navigation.navigate(path, {...farms})}>
          <LinearGradient colors={['#f87060', '#D34848']} style={{height:100, width:100, padding:10, alignItems:'center',justifyContent:'center', borderRadius:60,}}>
            <WhiteX size={54} />
          </LinearGradient>
        <Text style={{textAlign:'center', color:'#282C50', fontSize:16, fontWeight:"400"}}>{props.label}</Text>
      </TouchableOpacity>
    )
  }
// Button end --------------------------------------------

// Button Panel
  const ButtonPanel =()=>{
  if (Object.keys(APP_ROLES).includes(role)){
    return(
      <View style={{backgroundColor:'#EFF5FF',  justifyContent:'space-evenly', alignContent:'center', elevation:10,}}>
        <View>
          <Text style={{textAlign:'center', fontSize:20, color:'#282C50', marginTop:5, fontWeight:'bold'}}>FORMS PANEL</Text> 
          <Text style={{textAlign:'center', fontSize:14, color:'#8AB4CD', fontWeight:'400'}}>All form actions can be done here</Text> 
        </View>
        <View style={{backgroundColor:'#EFF5FF', marginBottom:0, justifyContent:'space-evenly', flexDirection: 'row', alignContent:'center',}}>
          {(role == APP_ROLES[0] || role == APP_ROLES[3] || role == APP_ROLES[4]) ? <RoundButtonNew path="Edit Form Select" farms={farms} props={{label:'Create & Edit'}}/>:null}
          {(role == APP_ROLES[0] || role == APP_ROLES[4] ) ? <RoundButtonEdit path="Review Form" farms={farms} props={{label:'Submission Review'}}/>:null}
          {(role == APP_ROLES[0] || role == APP_ROLES[1] || role == APP_ROLES[2]) ? <RoundButtonTick path="Review Form" farms={farms} props={{label:'Review Forms'}}/>: null}
          {(role == APP_ROLES[0] || role == APP_ROLES[3] || role == APP_ROLES[4]) ? <RoundButtonX path="Rejected Forms" farms={farms} props={{label:'Rejected Forms'}}/>: null}
        </View>
        <Text style={{paddingHorizontal:10, textAlign:'right', marginTop:-20}}>V. {pkg.version}</Text>
      </View>
    )
  }else{
    return(
      <View style={{backgroundColor:'#EFF5FF',  justifyContent:'space-evenly', alignContent:'center', elevation:10, paddingBottom:'2%'}}>
        <View>
          <Text style={{textAlign:'center', fontSize:20, color:'#282C50', marginVertical:10, fontWeight:'bold'}}>FORMS PANEL</Text> 
          {/* <Text style={{textAlign:'center', fontSize:14, color:'#8AB4CD', fontWeight:'400'}}>All form actions can be done here</Text>  */}
        </View>
        <View style={{backgroundColor:'#EFF5FF', marginBottom:10, alignItems:'center',}}>
          <View style={{backgroundColor:'pink',padding:'1%', alignItems:'center',borderRadius:10, width:'80%'}}>
            <Text style={{fontSize:15, fontWeight:'500'}}>There appears to be something wrong with the role you've been assigned.</Text>
            <Text>In order to access the application, you may need to update your role. To do so, kindly seek the help of the System Administrator for assistance.</Text>
          </View>
        </View>
      </View>
    );
  }
  }
  // Internet state
  useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    setNetInfo(state.isConnected && state.isInternetReachable ? 'Online' : 'Offline');
    global.setInternetAvailable(state.isConnected && state.isInternetReachable);
  });

  return () => unsubscribe();
  }, []);
  
  useEffect(() => {
  if (farms) {
    // console.log(farms);
    // global.setFarms(farms);
    global.setFormSchema(formFields);
    setLoading(false);
  } else {
    console.log("NOT LOADED");
  }
  // console.log('run once');
  }, [farms]);
  
  const getFarms = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${auth.authData.token}`
    }
  };

  const farmUrl = `${APP_API}/api/Farm/getFarmByOwner?id=${auth.authData.uuid}`;
  let farmArray;
  let asyncFarmArray;
  // try {
  // console.log('======================= GET FARMS ======================');
  // console.log('Trying  . . . ');
  await axios.get(farmUrl, config)
  .then((farmData)=>{
    // console.log(JSON.stringify(farmData.data));
    farmArray = farmData.data.map(farm => {
      return {
        id: farm.FarmId,
        farmNo: farm.FarmNo.trim(),
        name: farm.FarmName.trim(),
        type: farm.FarmStage === 1 ? "Grow" : "Production",
        feedReceived:farm.FeedReceived? Number(farm.FeedReceived.toFixed(2)):null,
        daysInInventory:farm.DaysInInventory? Number(farm.DaysInInventory.toFixed(2)):null,
        houses: farm.TblFlockMt
          .filter(house => house.FarmId === farm.FarmId && house.HouseNo.trim() !== '')
          .map(house => ({
            house: house.HouseNo.trim(),
            name: `house ${house.HouseNo.trim()}`,
            type: farm.FarmStage === 1 ? "Grow" : "Production",
            flockAge: house.FlockAge,
            flockNumber: house.FlockNumber.trim(),
            complexEntityNo: house.ComplexEntityNo.trim(),
            flockHoused: house.FlockHoused,
            flockHousedMale: house.FlockHousedMale,
            flockHousedFemale: house.FlockHousedFemale,
            flockStarted: house.FlockStarted,
            flockStartedMale: house.FlockStartedMale,
            flockStartedFemale: house.FlockStartedFemale,
            birdsBroughtForward: house.BirdBroughForward,
            birdsBroughForwardMale: house.BirdsBroughForwardMale,
            birdsBroughForwardFemale: house.BirdsBroughForwardFemale,
            flockBreed: house.BreedName.trim(),
            flockBreedNo: house.BreedNo.trim(),
          }))
          .sort((a, b) => a.house.localeCompare(b.house))
      };
    });
  })
  .catch((err)=>{
    console.log('Query Failed');
    console.log(err)
    // check for async farms
  })
  // console.log(await getFarmsFromAsync(auth.authData.uuid));
  // console.log(!farmArray);
    // } catch (error) {
    //   console.log(error);
    // }
    if(!farmArray)
      await getFarmsFromAsync(auth.authData.uuid)
      .then((response) => {console.log('Trying to get farms from async . . ');response? asyncFarmArray=response : null})
      .catch(()=>console.log('something went wrong'));
      
    // console.log(!farmFromAsync);

    if(farmArray){
      setFarms(farmArray);
      global.setFarms(farmArray);
      // console.log('Storing Farms');
      storeFarms(auth.authData.uuid, farmArray);
    }
    else if(!farmArray&&asyncFarmArray){
      global.setFarms(farmArray);
      setFarms(asyncFarmArray);
    }
    else if(!farmArray && !asyncFarmArray)
      setFarms(null);

    // const farmData = response.data;
    // const farmArray = farmData.map(farm => {
    //   return {
    //     id: farm.FarmId,
    //     farmNo: farm.FarmNo.trim(),
    //     name: farm.FarmName.trim(),
    //     type: farm.FarmStage === 1 ? "Grow" : "Production",
    //     houses: farm.TblFlockMt
    //       .filter(house => house.FarmId === farm.FarmId && house.HouseNo.trim() !== '')
    //       .map(house => ({
    //         house: house.HouseNo.trim(),
    //         name: `house ${house.HouseNo.trim()}`,
    //         type: farm.FarmStage === 1 ? "Grow" : "Production",
    //         flockAge: house.FlockAge,
    //         flockNumber: house.FlockNumber.trim(),
    //         flockHoused: house.FlockHoused,
    //         flockStarted: house.FlockStarted,
    //         flockBreed: house.BreedName.trim(),
    //         flockBreedNo: house.BreedNo.trim()
    //       }))
    //       .sort((a, b) => a.house.localeCompare(b.house))
    //   };
    // });

    setLoading(false);
    setRefresh(false);
  };
  
  useEffect(() => { 
  // console.log(netInfo);
  getFarms();
  }, [netInfo]);
  
  // Internet Status Bar
  const InternetStatus = () => {
  const bgColor =
    netInfo == 'Online'
      ? '#0C5A40'
      : netInfo == 'Offline'
      ? '#560909'
      : 'grey';
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: bgColor,
      }}>
      <Text style={{color: 'white'}}>{netInfo}</Text>
    </View>
  );
  };

  const TestButton = ({ func }) => {
    return (
      <TouchableOpacity onPress={async ()=>{func.func([`https://jsonplaceholder.typicode.com/todos/1`,undefined,undefined,undefined])}}>
        <Text>Add Query</Text>
      </TouchableOpacity>
    )
  }
  const TestButton5 = ({ func }) => {
    return (
      <TouchableOpacity onPress={async ()=>{func.func([`https://jsonplaceholder.typicode.com/tos/1`,undefined,undefined,undefined])}}>
        <Text>Add Bad Query</Text>
      </TouchableOpacity>
    )
  }
  const TestButton2 = () => {
    return (
      <TouchableOpacity onPress={()=>{setLoading(true);getFarms()}}>
        <Text>Refresh</Text>
      </TouchableOpacity>
    )
  }
  const TestButton3 = () => {
    return (
      <TouchableOpacity onPress={()=>{global.processQuery()}}>
        <Text>Process Queries</Text>
      </TouchableOpacity>
    )
  }
  const TestButton6 = () => {
    return (
      // <TouchableOpacity onPress={()=>{executeQuery([`https://jsonplaceholder.typicode.com/todos/1`,undefined,undefined,undefined]).then((e)=>console.log(e))}}>
      <TouchableOpacity onPress={async ()=>{console.log( await getFarmFromAsync(uuid, "MARYLAND FARM 2"))}}>
        <Text>Get Farms from async</Text>
      </TouchableOpacity>
    )
  }
  const TestButton4 = () => {
    return (
      // <TouchableOpacity onPress={()=>{executeQuery([`https://jsonplaceholder.typicode.com/todos/1`,undefined,undefined,undefined]).then((e)=>console.log(e))}}>
      <TouchableOpacity onPress={async ()=>{const b = await executeQuery([`https://jsonplaceholder.typicode.com/toodos/1`]);console.log(b.data);}}>
        <Text>execute Queries</Text>
      </TouchableOpacity>
    )
  }
//  console.log(farms);
  return (
    !loading?   
    <View style={styles.container}>
      <View
        style={{
          paddingTop: 10,
          backgroundColor: 'white',
        }}>
        <Header />
        {/* <Text style={{paddingHorizontal:10, textAlign:'right'}}>V. {pkg.version}</Text> */}
        <InternetStatus />
      </View>
      <View style={{flex:1,}}>
      <LinearGradient colors={["#edf2fb","#ccdbfd",]}>
      {/* <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={["#FFEBBC","#d8f3dc"]}> */}
      {/* <LinearGradient colors={["#E0E8FC","#748FD3","#33519D","#1A3069",]}> */}
      <ScrollView  
          refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={()=>{setRefresh(true); getFarms()}} />
        }>
        <View style={{paddingBottom:50}}>
          <Text style={{marginLeft:'10%', marginTop:10, fontSize: 34, fontWeight:'500', color:'black'}}>DASHBOARD</Text>
          <View style={{paddingHorizontal:10,flexDirection:'row', justifyContent:'space-between',}}>
              <Text style={{marginLeft:'10%', marginTop:20, fontSize: 24, color:'black'}}>Welcome, </Text>
          </View>
          <View style={{backgroundColor:'#282C50', width:'auto', justifyContent:'space-around', alignSelf:'center',borderRadius:10,marginBottom:30}}>
            <View
            style={{
              borderRadius:10,
              backgroundColor:'#282C50',
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <View style={{flexDirection:'row', alignItems:'center',marginRight:'2%'}}>
                  <UserProfileIcon size={72} />
                  <View>
                    <Text style={{fontSize:20, color:'#FFC700'}}>{name}</Text>
                    <Text style={{fontSize:14, color:'#AAAAAA'}}>{email.toUpperCase()}</Text>
                    <Text style={{fontSize:14, color:'#FFFFFF'}}>{role.toUpperCase()}</Text>
                  </View>
              </View>
              <View style={{flexDirection:'row', alignItems:'center', minWidth:'40%', justifyContent:'space-around'}}>
                  <View style={{marginRight:5, flexDirection:'row', alignItems:'center'}}>
                    <CalnderIcon size={72} />
                    <View>
                      <Text style={{color:'#9F9ECC', fontSize:16, marginVertical:0, paddingVertical:0}}>{jamaicanDateFormat()}</Text>
                      <Text style={{color:'white', fontSize:28}}>{WEEKDAY[new Date().getDay()].toUpperCase()}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.button} onPress={signOut}>
                    <Text
                      style={{
                        // color: '#282C50',
                        color: '#A66363',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      SIGN OUT
                    </Text>
                  </TouchableOpacity>
              </View>                
            </View>     
          </View>
          <View
            style={{
              paddingTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 30, color: '#282C50', fontWeight: 'bold'}}>
              MY FARMS
            </Text>
            <View style={{flex:1, marginHorizontal:30}}>
            { 
              loading ?
               <ActivityIndicator size="large" color="red" /> 
               :
                farms ? farms.map((farm, index) => {
                return <FarmTile farm={farm} key={index} />;
              }):<View style={{minHeight:600}}><Text>We're having some trouble loading your farms</Text></View>
            }
            </View>
          </View>
          {/* <EditFormDetails /> */}
        </View>
      </ScrollView>
      </LinearGradient>
      </View>
      <ButtonPanel />
    </View>:<Loading />
    // : refreshing ? <ActivityIndicator size='large' color='red'/> 
  );
}
// };
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E8FC',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#6B0C0C',
    // backgroundColor: '#FFC700',
    padding: 10,
    borderRadius: 5,
    marginLeft:20
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282C50',
    color: '#ffff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal:5,
    marginLeft:20
  },
});
