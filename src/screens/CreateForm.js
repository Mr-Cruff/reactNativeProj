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
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../contexts/Auth';
import { doesFormExist } from '../services/AsyncStorage';
import { convertToCSharpCompatibleFormat, defaultFields, nth } from '../services/Helpers';
import { MONTH } from '../Constants';

const CreateForm = ({ route, navigation }) => {
    const { name } = useAuth().authData;
    const { farms } = route.params.farms;
    const [farmSelected, setFarmSelected] = useState('none');
    const [houseSelected, setHouseSelected] = useState('none');
    const [farmHouse, setFarmHouse] = useState(null);
    const [date, setDate] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFeedRec, setFeedRecVisibility] = useState(false);
    const [feedRecieved, setFeedRecieved] = useState("");
    const [eggsDelivered, setEggsDelivered] = useState("");

    // console.log(route.params);

    const setMinDate = () =>{
      var date = new Date();
      // var firstDay= date.getDate() - date.getDay()
      var minDate= new Date(date.setDate(date.getDate()-6))
      return minDate;
    }

    // const setMinDate = () =>{
    //   var date = new Date();
    //   var firstDay= date.getDate() - date.getDay()
    //   var minDate= new Date(date.setDate(firstDay))
    //   return minDate;
    // }

    const formIdCalc = (farm, house, date) => {
      let today = date;
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
    
      const formIdTemp = "" + dd + mm + yyyy + farm.name + house.name;
      const formIdFinal = formIdTemp.replace(/\s/g, '').toLowerCase();
      return formIdFinal;
    }

    const FarmSelect = () => {
      if (farms.length > 1) {
        let farmNames=[];
        return (
          <View>
            <Picker
              style={{backgroundColor: 'white', height: 60, marginTop:0}}
              selectedValue={farmSelected}
              onValueChange={(farmName, farmIndex) => {setHouseSelected('none'); setFarmSelected(farmName)}}>
                <Picker.Item label="Select a Farm" value="none" key={'none'} />
                {farms.map((farm, index) => {
                  if(farmNames.includes(farm.name)){
                  }else{
                    farmNames=[...farmNames, farm.name];
                    return(
                      <Picker.Item label={farm.name} value={index} key={index} />
                    );
                }
            })}
            </Picker>
            <Text style={{marginTop:10, color:'#9EADD3', textAlign:'center'}}>{(farmSelected != 'none') ? '': 'Select a Farm from the picker ABOVE to see form for REVIEW'}</Text>
          </View>
        );
      } 
    };
  
    const SingleFarm = () => {
      // setFarmSelected(farms[0].name);
      return <Text style={{fontSize:24, fontWeight:'bold', color:'#282C50'}}>{farms[0].name}</Text>;
    }
  
    const HouseSelect = () => {
      return (
        <View>
          <Text style={{marginTop:10,marginBottom:10, color:'#9EADD3', textAlign:'center'}}>{(farmSelected == 'none' || houseSelected != 'none') ? '': 'Select a House from the picker BELOW to move forward'}</Text>
          <Picker
            style={{backgroundColor: 'white', height: 60}}
            selectedValue={houseSelected}
            onValueChange={(itemValue, itemIndex) => {
              itemValue != 'none'
                ? setFarmHouse({
                    Farm: farms[farmSelected],
                    House: farms[farmSelected]?.houses[itemValue],
                  })
                : '';
              setHouseSelected(itemValue);
            }}>
            <Picker.Item label="Select a House" value="none" key="none" />
              {farms[farmSelected]?.houses.map((house, houseIndex) => (
                <Picker.Item
                  label={house.name}
                value={houseIndex}
                  key={houseIndex}
                />
              ))}
          </Picker>
        </View>
      );
    };

    const saveForm = async x => {
      //Check if the form already exists in the @Forms array by looping through and checking the form id
        //If FormId exists, overwrite form
        //if FormId isn't found, add form to the array
        const arrForm = [x];
        
        const storedForms = await AsyncStorage.getItem('@forms');
        let storedFormsParsed = JSON.parse(storedForms);
        
        if (storedForms !== null) {
          //loop through stored forms to see if the form already exists
          let found = false;
          for (let form in storedFormsParsed){
          if (storedFormsParsed[form]["Form Id"] == x["Form Id"]){
            found=true;
            let updatedForm = {...storedFormsParsed[form], ...x};
            storedFormsParsed[form] = updatedForm;
            await AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed));
            break;
          }
          }

          if(found === false){
          // console.log('================================    FORM NOT Found');
          storedFormsParsed.push(x);
          await AsyncStorage.setItem('@forms', JSON.stringify(storedFormsParsed));
          }
        } else {
          try {
            // console.log('================================  No Forms Stored');
            await AsyncStorage.setItem('@forms', JSON.stringify(arrForm));
          } catch (error) {
            Alert.alert("Error!", "Unable to save FORM");
          }
        }
      
    };

    const confirmNewForm = async () => {
      const newForm = createFormBody();
      if (farmSelected != 'none' && houseSelected != 'none' && farmHouse != null) { 
        if(await doesFormExist(newForm["Form Id"]) === true){        
          Alert.alert('Error!', "This form has already been created. Go to `Edit Forms` to make changes to this form, otherwise the form has been submitted and cannot be re-created or edited.");
        }else{
          saveForm(newForm);
          Alert.alert(`Notification`,`Would you like to edit this form now?`,
            [
              {
                text: 'No, Close',
                onPress: () => navigation.goBack(),
                style: 'cancel',
              },
              {
                text: 'Yes, Edit form',
                // onPress: () => console.log({formSelected:newForm, farmSelected:farmHouse}),
                onPress: () => navigation.navigate('Edit Form', {formSelected:newForm, farmSelected:farmHouse}),
              },
            ]
          );
        }
      }
    }

    const createFormBody =()=>{   
    // const createFormBody =({ Farm, House, name })=>{   
      const { Farm, House } = farmHouse;
      // console.log({...{"Form Id": formIdCalc(Farm, House), "Farm":Farm.name, "House":House.name, "FarmNo":Farm.farmNo, "Created By":name, "Date Created":date.toJSON(), "Status":'Incomplete'}, ...defaultFields});
      // return {...{"Form Id": formIdCalc(Farm, House), "Farm":Farm.name, "House":House.name, "FarmNo":Farm.farmNo, "Created By":name, "Date Created":date.toJSON(), "Status":'Incomplete'}, ...defaultFields}
      
      
      // if(showFeedRec)
      //   return {"Form Id": formIdCalc(Farm, House), "Farm":Farm.name, "House":House.name, "FarmNo":Farm.farmNo, "Created By":name, "Date Created":date.toJSON(), "Status":'Incomplete', "Eggs":{"Eggs Delivered":parseInt(eggsDelivered)},"Feed Inventory":{"Feed Recieved (lbs)":parseFloat(feedRecieved)}}
      // else
      // return {"Form Id": formIdCalc(Farm, House, date), "Farm":Farm.name, "House":House.name, "FarmNo":Farm.farmNo, "Created By":name, "Date Created":convertToCSharpCompatibleFormat(date), "Status":'Incomplete'}
      return {"Form Id": formIdCalc(Farm, House, date), "Farm":Farm.name, "House":House.name, "FarmNo":Farm.farmNo, "Created By":name, "Date Created":convertToCSharpCompatibleFormat(date), "Status":'Incomplete'}
    }

    useEffect(() => {
      farms.length == 1 ? setFarmSelected(0) : "none";
    },[]);
    
    // const RadioOption = () => {
    //   return (
    //     <View >
    //       <RadioButton.Group  onValueChange={value => setFeedRecVisibility(value)} value={showFeedRec}>
    //         <View style={{flexDirection:"row"}}>
    //           <View style={{flexDirection:"row", alignItems:'center'}}>
    //             <RadioButton value={false} />
    //             <Text>NO</Text>
    //           </View>
    //           <View style={{flexDirection:"row", alignItems:'center'}}>
    //             <RadioButton value={true}/>
    //             <Text>YES</Text>
    //           </View>
    //         </View>
    //       </RadioButton.Group>
    //     </View>
    //   );
    // };

    // const handleChange = (e) => {
    //   setFeedRecieved(e.replace(/[- #*;,<>\+\=\(\)\{\}\[\]\\\/]/gi, ''))
    // }

    // const EggsDelivered = () => {
    //   const label = "Eggs Delivered"
    //   return (
    //     <View style={{flexDirection:"row", alignItems:'center', marginLeft:'10%', textAlign:'center',}}>
    //       <Text style={{color:'black', fontSize:17,height:40,textAlignVertical:'center'}}>{"How many eggs were sent?"}</Text>
    //       <TextInput                           
    //         style={{marginLeft:'3%', textAlign:'right', fontSize:16, height:40, backgroundColor:'white'}}
    //         placeholder={label}
    //         defaultValue={eggsDelivered}
    //         keyboardType={"number-pad"}
    //         onChangeText={setEggsDelivered}
    //         value={eggsDelivered}
    //       />
    //       <Text style={{height:40,textAlignVertical:'center',fontSize:17, color:'black'}}>{" eggs"}</Text>
    //       {/* <TouchableOpacity onPress={()=>{setFeedRecieved(feedRecieved)}}><Text>OK</Text></TouchableOpacity> */}
    //     </View>
    //   )
    // }

    return (
      <View style={styles.container}>
        <Text
          style={{
            color: '#282C50',
            fontSize: 32,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 30,
          }}>
          CREATE FORM
        </Text>
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
        {farms.length != 1 ? <FarmSelect /> : <SingleFarm />}
        {farmSelected != 'none'&& farms[farmSelected].type.toLowerCase() != "grow" && (
          <View style={{backgroundColor:'beige'}}>
            <View>
              <Text  style={{paddingLeft:10, backgroundColor:'#d4cc47', color:'#565214', fontSize:18, fontWeight:'500'}}>Eggs Delivered</Text>
              <Text style={{paddingLeft:10, marginTop:10}}>Were 'Eggs Delivered' from {farms[farmSelected].name} on {MONTH[date.getMonth()]} {date.getDate()}{nth(date.getDate())}?</Text>
            </View>
            <View style={{flexDirection:"row", justifyContent:'flex-end'}}>
              {/* <RadioOption /> */}
              {/* {showFeedRec && EggsDelivered()} */}
              <TouchableOpacity style={{textAlign:'center', backgroundColor:'#282C50', borderRadius:5,padding:10, margin:10}} onPress={()=>navigation.navigate('Egg Delivery', {farmSelected:farms[farmSelected]})}>
                  <Text style={{color:'white', fontSize:16}}>Record Egg Delivery</Text>
              </TouchableOpacity>
              {/* <Button title="Log Delivery" onPress={()=>navigation.navigate('Egg Delivery', {farmSelected:farms[farmSelected]})}/> */}
            </View>
          </View>
        )}
        {farmSelected != 'none' && <HouseSelect />}

        {farmSelected != 'none'&& farms[farmSelected].type.toLowerCase() != "grow" && houseSelected !== 'none' && (
          <View style={{backgroundColor:'beige', marginTop:40}}>
            <View>
              <Text  style={{paddingLeft:10, backgroundColor:'#d4cc47', color:'#565214', fontSize:18, fontWeight:'500'}}>Birds Capitalized</Text>
              <Text style={{paddingLeft:10, marginTop:10}}>Would you like to create a <Text style={{fontWeight:'bold'}}>Birds Capitalized</Text> transaction for {farms[farmSelected].name}, {farms[farmSelected]?.houses[houseSelected].name}, on {MONTH[date.getMonth()]} {date.getDate()}{nth(date.getDate())}?</Text>
            </View>
            <View style={{flexDirection:"row", justifyContent:'flex-end'}}>
              {/* <RadioOption /> */}
              {/* {showFeedRec && EggsDelivered()} */}
              <TouchableOpacity style={{textAlign:'center', backgroundColor:'#282C50', borderRadius:5,padding:10, margin:10}} onPress={()=>navigation.navigate('Birds Capitalized', {farmSelected:farms[farmSelected], house:farms[farmSelected]?.houses[houseSelected]})}>
                  <Text style={{color:'white', fontSize:16}}>Create Transaction</Text>
              </TouchableOpacity>
              {/* <Button title="Log Delivery" onPress={()=>navigation.navigate('Egg Delivery', {farmSelected:farms[farmSelected]})}/> */}
            </View>
          </View>
        )}
        <TouchableOpacity disabled={farmSelected == 'none' || houseSelected == 'none'} style={{maxWidth:250, alignSelf:'flex-end', width:200, marginTop:'5%'}} onPress={()=> {setLoading(true); confirmNewForm();}}>
           <Text style={{textAlign:'center', backgroundColor:farmSelected == 'none' || houseSelected == 'none'?'grey':'#282C50', borderRadius:5,padding:10, fontSize:17, color:'white', elevation:5}}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    );
};

export default CreateForm;

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
    padding: 10,
    borderRadius: 5,
    width: 300,
  },
});