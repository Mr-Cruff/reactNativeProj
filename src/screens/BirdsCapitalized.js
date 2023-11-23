import React, {useEffect, useState} from 'react';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../contexts/Auth';
import { executeApiQuery, jamaicanDateFormat, nth, setMinDate } from '../services/Helpers';

const BirdsCapitalized =({ route, navigation })=>{
  const {farmSelected, house}=route.params;
  const bOH = house?.birdsBroughtForward;
  const {token} = useAuth().authData;
  const [loading, setLoading] = useState(true);
  const [qLoading, setQLoading] = useState(false);
  const [malesCap, setMalesCap] = useState(null);
  const [hensCap, setHensCap] = useState(null);
  const [capAge, setCapAge] = useState(null);
  const [dateTimeCap, setDateTimeCap] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [errors, setErrors] = useState({});
  const totalCap = malesCap+hensCap;

  
  useEffect(()=>{
    setLoading(false);
  },[]);
  
  const areFieldsValid = () => {
    return malesCap > 0 && hensCap > 0 && capAge > 0 && dateTimeCap && totalCap<=bOH;
  };

  const validateFields = () => {
      let tempErrors = {};
      if (malesCap <= 0 || !malesCap) tempErrors.malesCap = "Value should be greater than 0";
      if (hensCap <= 0 || !hensCap) tempErrors.hensCap = "Value should be greater than 0";
      if (capAge <= 0 || !capAge) tempErrors.capAge = "Value should be greater than 0";
      if (house.birdsBroughtForward < hensCap+malesCap) tempErrors.birdsCap = "Total birds capitalized must be less than birds on hand";

      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;  // Returns true if no errors
  }

  const handleTextChangeInt = (text) => {
    // Check if the text is an integer or is empty (to allow deleting input)
    if (/^-?\d*$/.test(text) || text === '') {
      // Convert the text to an integer and return
      return text === '' ? null : parseInt(text, 10);
    }
    return undefined; // Return null or the previous value if the input is not valid
  };

  const handleTextChangeFloat = (text) => {
    // Check if the text is a float, an integer, or is empty (to allow deleting input)
    if (/^-?(\d+(\.\d*)?|\.\d+)$/.test(text) || text === '') {
      if (text.endsWith('.') || text === '.') {
        return text;
      }
      // Convert the text to a float and update the state
      return text === '' ? null : parseFloat(text);
    }
    return undefined;
  };

  const submitBirdsCapitalized = async () => {
    setQLoading(true);
    if (!validateFields()) {
      Alert.alert("Validation Error", `Please correct the following fields before submitting:${Object.keys(errors).map((i,idx)=>`\n ${idx + 1}. ${errors[i]}`)}`, [
        { text: "OK", onPress: () => setQLoading(false) }
        ]);
      return;
    }
    const url = '/api/BirdsCapitalization/NewBirdsCapitizationRecord';
    const bcRecord = {
      "farmNo": farmSelected.farmNo,
      "complexEntityNo": house.complexEntityNo,
      "dateTimeCap": dateTimeCap.toJSON(),
      "malesCap": malesCap,
      "hensCap": hensCap,
      "capAge": capAge,
    };
    try {
      const capitalizationData = await executeApiQuery(url, token, "POST", bcRecord, undefined);
      if (capitalizationData.status === 200) {
          Alert.alert("Success", "Bird Capitalization record was submitted successfully.", [
              { text: "OK", onPress: () => { navigation.goBack(); navigation.goBack(); } }
          ]);
      } else {
          throw new Error(capitalizationData.status);
      }
      setQLoading(false)
    } catch (error) {
      setQLoading(false)
      Alert.alert("Failed", `Bird Capitalization record submission failed.\nError: ${error.message}`);
    }
  }
  const isValid = () => totalCap>bOH;

  return(
    <ScrollView  style={styles.container}>
      <Text style={styles.pageTitle}>BIRDS CAPITALIZED</Text>
      {!loading?
        <View style={{margin:10}}>
          <View style={{flexDirection:'row', justifyContent:'space-around', flexWrap:'wrap', backgroundColor:'beige', padding:30, marginHorizontal:10, marginBottom:30}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:20, color:'grey'}}>FARM: </Text>
              <Text style={{paddingHorizontal:5, fontSize:20, fontWeight:'500',color:'#282C50'}}>{farmSelected.name}</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:20, color:'grey'}}>HOUSE: </Text>
              <Text style={{paddingHorizontal:5, fontSize:20, fontWeight:'500', color:'#282C50'}}>{house.name.toUpperCase()}</Text>
            </View>
            {house.birdsBroughtForward && <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:20, color:'grey'}}>BIRDS ON-HAND: </Text>
              <Text style={{paddingHorizontal:5, fontSize:20, fontWeight:'500', color:'#282C50'}}>{house.birdsBroughtForward}</Text>
            </View>}
          </View>
          <View style={{padding:10}}>
            <Text style={{color: '#282C50', fontSize: 18}}>Date Capitalized</Text>
            <TouchableOpacity onPress={()=>setIsVisible1(true)}  style={{padding:20, backgroundColor:'beige'}}>
            <Text style={{color:'black'}}>{!dateTimeCap?" -  Select Date Capitalized - ":`${jamaicanDateFormat(dateTimeCap)}`}</Text>
            {
              isVisible1 && 
              <DateTimePicker 
                defaultValue={new Date()} 
                minimumDate={setMinDate()}
                maximumDate={new Date()}  
                value={dateTimeCap || new Date()} 
                is24Hour={false} 
                onChange={(event, selectedDate)=>{
                  if (event.type === 'set') {
                    setIsVisible1(false);
                    setDateTimeCap(selectedDate);
                  } else if (event.type === 'dismissed') {
                    setIsVisible1(false);
                  }
                }}
              />
            }
            </TouchableOpacity> 
          </View>
          {isValid() && <Text style={{marginTop:20,color:'red', textAlign:'center', fontSize:18}}>* Total birds capitalized must NOT be more than BIRDS ON-HAND *</Text>}
          <View style={{padding:10}}>
            <Text style={{color: '#282C50', fontSize: 18}}>Males Capitalized</Text>
            <TextInput
              style={styles.input}
              placeholder={'Males Capitalized'}
              onChangeText={(text) => {
                const newValue = handleTextChangeInt(text);
                  if (newValue !== undefined) {
                    setMalesCap(newValue);
                  }
                }
              }
              value={malesCap === null ? '' : String(malesCap)}
              keyboardType={"number-pad"}
            />   
          </View>
          <View style={{padding:10}}>
            <Text style={{color: '#282C50', fontSize: 18}}>Hens Capitalized</Text>       
            <TextInput
              style={styles.input}
              placeholder={'Hens Capitalized'}
            onChangeText={(text) => {
              const newValue = handleTextChangeInt(text);
              if (newValue !== undefined) {
                setHensCap(newValue);
              }
            }}
            value={hensCap === null ? '' : String(hensCap)}
              keyboardType={"number-pad"}
            />
          </View>

          <Text style={{paddingHorizontal:10, textAlign:'right', fontSize:15}}>Total birds capitalized: <Text style={{color:isValid()?'red':'#282C50', fontWeight:isValid()?'bold':"normal", fontSize:16}}>{totalCap}</Text></Text>
          <View style={{padding:10}}>
            <Text style={{color: '#282C50', fontSize: 18}}>Capitalization Age</Text>
            <TextInput
              style={styles.input}
              placeholder={'Capitalization Age'}
              onChangeText={(text) => {
                const newValue = handleTextChangeFloat(text);
                if (newValue !== undefined) {
                  setCapAge(newValue);
                }
              }}
            value={capAge === null ? '' : String(capAge)}
              keyboardType={"decimal-pad"}
            />  
          </View>
          {!qLoading ? <TouchableOpacity disabled={!areFieldsValid()} onPress={submitBirdsCapitalized} style={!areFieldsValid()? styles.saveButtonDisabled : styles.button}>
            <Text style={areFieldsValid() ? styles.buttonText: {color:"grey"}}>Submit</Text>
          </TouchableOpacity>:<ActivityIndicator size={'large'}/> }           
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

export default BirdsCapitalized;


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
      marginVertical: 20,
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
  input: {
    color: '#282C50',
    backgroundColor: 'white',
    height: 50,
    borderWidth: 0,
    borderRadius: 2,
    fontSize: 16,
    minWidth: 150,
  },    buttonText:{
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});