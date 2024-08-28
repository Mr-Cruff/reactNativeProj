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
} from 'react-native';
import {Category} from '../components/Category';
import {getItem, getAllItems} from '../services/AsyncStorage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../contexts/Auth';

//Mock Form MetaData
const formFields = [
  {
    title: 'Culls & Mortality',
    type: 'common',
    fields: [
      {label: 'Culls - Male', type: 'int', fieldName:"", placeholder:""},
      {label: 'Mortality - Male', type: 'int'},
      {label: 'Culls - Female', type: 'int', fieldName:"", placeholder:""},
      {label: 'Mortality - Female', type: 'int'},
      {label: 'Dead on Arrival', type: 'int'},
    ],
  },
  {
    title: 'Feed Inventory',
    type: 'common',
    fields: [
      //Feed Inventory
      {label: 'Feed Brought Forward (lbs)', type: 'float'},
      {label: 'Feed Recieved (lbs)', type: 'float'},
      {label: 'Feed Transferred (lbs)', type: 'float'},
      {label: 'Feed Spoilage (lbs)', type: 'float'},
      {label: 'Days in Inventory', type: 'float'},
      //Feed Consumed
      {label: 'Feed Time', type: 'time'},
      {label: 'Feed Consumption Time', type: 'justTime'},
      {label: 'Feed Consumed (lbs) -  Male', type: 'float'},   //Conditional fields based on gender
      {label: 'Feed Consumed (lbs) -  Female', type: 'float'}, //Conditional fields based on gender
      {label: 'Feed Distribution  - Male', type: 'option', options:['GOOD','POOR']},
    ],
  },
  {
    title: 'Miscellaneous',
    type: 'common',
    fields: [
      {label: 'Water Consumption', type: 'float'},
      {label: 'Bird Weight - Male', type: 'float'},
      {label: 'Bird Weight - Female', type: 'float'},
      {label: 'Uniformity - Male', type: 'float'},
      {label: 'Uniformity - Female', type: 'float'},
      {label: 'All Clocks on Time', type: 'option', options:['YES','NO']},
      {label: 'Lights', type: 'option', options:['ON','OFF']},
      {label: 'Lighting Hours', type: 'float'},
      {
          label: 'Temperature Min', 
          type: 'time',
          fields: [
            {label: 'Min 1st Entry', type: 'float', view:'value-time'},
            {label: 'Min 2nd Entry', type: 'float', view:'value-time'}
          ]
      },
      {
        label: 'Temperature Max', 
        type: 'time',
        fields: [
          {label: 'Max 1st Entry', type: 'float', view:'value-time'},
          {label: 'Max 2nd Entry', type: 'float', view:'value-time'}
        ]
      },
      {label: 'Observation/Comments', type: 'description'},
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
          {label: 'Hatching 1st Entry', type: 'int'},
          {label: 'Hatching 2nd Entry', type: 'int'},
          {label: 'Hatching 3rd Entry', type: 'int'},
          {label: 'Hatching 4th Entry', type: 'int'},
        ],
      },
      {label: 'Reject Eggs', type: 'multi-field', fields: [
        {label: 'Rejects 1st Entry', type: 'int'},
        {label: 'Rejects 2nd Entry', type: 'int'},
        {label: 'Rejects 3rd Entry', type: 'int'},
        {label: 'Rejects 4th Entry', type: 'int'},
      ],
      },
      {label: 'Dumps', type: 'multi-field', fields: [
        {label: 'Dumps 1st Entry', type: 'int'},
        {label: 'Dumps 2nd Entry', type: 'int'},
        {label: 'Dumps 3rd Entry', type: 'int'},
        {label: 'Dumps 4th Entry', type: 'int'},
      ],},
      {label: 'Double Yolked Eggs', type: 'multi-field', fields: [
        {label: 'Double Yolked 1st Entry', type: 'int'},
        {label: 'Double Yolked 2nd Entry', type: 'int'},
        {label: 'Double Yolked 3rd Entry', type: 'int'},
        {label: 'Double Yolked 4th Entry', type: 'int'},
      ],},
      {label: 'Eggs Delivered', type: 'int'},
      {label: 'Net Egg Weight', type: 'float'},
      {label: 'Average Egg Weight', type: 'float'},
      {label: 'Egg Room Temp (Wet)',
          type: 'time',
          fields: [
            {label: 'Egg Wet 1st Entry', type: 'float', view:'value-time'},
            {label: 'Egg Wet 2nd Entry', type: 'float', view:'value-time'}
        ]
      },
      {label: 'Egg Room Temp (Dry)',
      type: 'time',
      fields: [
        {label: 'Egg Dry 1st Entry', type: 'float', view:'value-time'},
        {label: 'Egg Dry 2nd Entry', type: 'float', view:'value-time'}
    ]},
      {label: 'Egg Room Humidity (%)', type: 'float'},
    ],
  },
  {
    title: 'Vaccination',
    type: 'pullet',
    fields: [
      {label: 'Type/Description', type: 'string'},
      {label: 'Quantity', type: 'float'},
      {label: 'Serial Number', type: 'string'},
    ],
  },
];

const NewForm = ({route, navigation, back}) => {
  const auth = useAuth();
  const { name }= auth.authData;
  const [formId, setFormId] = useState();
  
  //all forms that come from asycnStorage
  const [forms, setForms] = useState([]);
  
  const [selected, setSelected] = useState(-10);
  
  const farmDetails = route.params.Farm;
  const houseSelected = route.params.House;

  // console.log(farmDetails)
  const [date, setDate] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  const formIdCalc = () => {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
    
      const formIdTemp = "" + dd + mm + yyyy + farmDetails.name + houseSelected.name;
      const formIdFinal = formIdTemp.replace(/\s/g, '').toLowerCase();
      return formIdFinal;
  }
  // console.log(farmDetails);
  //the new form being created currently
  const [newForm, setNewForm] = useState({"Form Id": formIdCalc(), "Farm":farmDetails.name, "House":houseSelected.name, "FarmNo":farmDetails.farmNo, "Created By":name, "Date Created":date, "Status":'Incomplete'});

  const addToNewForm = newCategory => {
    setNewForm(obj => ({...obj, ...newCategory}));
  };

  const saveForm = async x => {
    //Check if the form already exists in the @Forms array by looping through and checking the form id
    //If FormId exists, overwrite form
    //if FormId isn't found, add form to the array
    const arrForm = [x];

    const storedForms = await AsyncStorage.getItem('@forms');
    let storedFormsParsed = JSON.parse(storedForms);

    if (storedForms !== null) {
      //console.log('ASYNC ===============');
      //console.log(storedFormsParsed);
      // console.log(storedFormsParsed);
      // const combined = [...storedFormsParsed, arrForm];


      //loop through stored forms to see if the form already exists
      let found = false;
      for (let form in storedFormsParsed){
        if (storedFormsParsed[form]["Form Id"] == x["Form Id"]){
          // console.log('================================   Found ID');
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
      
      //console.log('Combined ===============');
      //console.log(combined);
      
      // console.log(JSON.stringify(arrForm));
      // await AsyncStorage.setItem('@forms', JSON.stringify(arrForm));
    } else {
      try {
        // console.log('================================  No Forms Stored');
        await AsyncStorage.setItem('@forms', JSON.stringify(arrForm));
      } catch (error) {
        Alert.alert("Error!", "Unable to save FORM");
    }
      }
  };

  const getFormSchema = async () => {
    let categories = [];
    try {
      //Try API call, then update categories
      // ..
      // ..

      let storedCategories = await AsyncStorage.getItem('@formCategories');
      if (storedCategories !== null) {
        categories = JSON.parse(storedCategories);
      }
      categories.push(categories);
      await AsyncStorage.setItem('forms', JSON.stringify(categories));
    } catch (error) {
      //error
    }
  };

  const FormDisplay = () => {
    return selected == 100 ? (
      <ReviewForm />
    ) : selected == -10 ? (
      <View>
        <Text style={{fontSize:17, padding:10, alignSelf:'center', color:'#94a0ad'}}>Select a Cagetory from the above dropdown to get started</Text>
      </View>
    ) : (
      <Category addToNewForm={addToNewForm} props={formFields[selected]} />
    );
  };

  const handleSubmit = () => {
    Alert.alert(
      'Notification',
      `Go to 'EDIT FORM' to make further changes to this form`,
    );
    navigation.navigate('Home');
  };

  const ReviewForm = () => {
    return (
      <ScrollView>
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 32, textAlign: 'center'}}>
            Review Form
          </Text>
          {Object.keys(newForm).map((item, index) => {
            if (typeof newForm[item] != 'object') {
            }else{
              return (
              <View key={index}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginTop: 20,
                    paddingBottom: 5,
                  }}>
                  {item}
                </Text>
                {Object.keys(newForm[item]).map((field, indx) => {
                  if (typeof newForm[item][field] != 'object') {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                        key={indx}>
                        <Text style={{fontSize: 18}}>{field}:</Text>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginLeft: 5,
                          }}>
                          {newForm[item][field]}
                        </Text>
                      </View>
                    );
                  } else {
                    return (
                      <View key={indx}>
                        <Text style={{fontSize: 18}}>{field}:</Text>
                        {Object.keys(newForm[item][field]).map(
                          (subField, subIndex) => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginLeft: 20,
                                }} key={subIndex}>
                                <Text style={{fontSize: 18}}>{subField}:</Text>
                                <Text
                                  style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    marginLeft: 5,
                                  }}>
                                  {newForm[item][field][subField]}
                                </Text>
                              </View>
                            );
                          },
                        )}
                      </View>
                    );
                  }
                })}
              </View>
              );
            }
          })}
          <View style={{marginVertical: 30}}>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={{color: 'white'}}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  useEffect(() => {
    // console.log('STATE: ====================================');
    // console.log(newForm);
    saveForm(newForm);
  }, [newForm]);

  useEffect(() => {
    formIdCalc();
  }, []);

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
        {/* ---- Row 1 */}
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
            <Text style={{fontSize: 16}}>Farm Type:</Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 16,
              }}>
              {farmDetails.type}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 16}}>Farm Name: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 16,
              }}>
              {farmDetails.name}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 16}}>House Selected: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 16,
              }}>
              {houseSelected.name}
            </Text>
          </View>
        </View>
        
        {/* ---- Row 2 */}
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
            <Text style={{fontSize: 16}}>Flock Number:</Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 16,
              }}>
              {houseSelected.flockNumber}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 16}}>Age: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 16,
              }}>
              {houseSelected.flockAge} Weeks
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 16}}>Flock Breed: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 16,
              }}>
              {houseSelected.flockBreed}
            </Text>

          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 16}}>Flock Housed: </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 5,
                fontSize: 16,
              }}>
              {houseSelected.flockHoused}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const setMinDate = () =>{
    var date = new Date();
    var firstDay= date.getDate() - date.getDay()
    var minDate= new Date(date.setDate(firstDay))
    return minDate;
  }

  const [shouldSave, setSave] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,
          color: '#282C50',
        }}>
        NEW FORM
      </Text>
      <FarmSummary />
      <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
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
        <TouchableOpacity style={{maxWidth:250}} onPress={()=>navigation.goBack()}>
           <Text style={{backgroundColor:'#560909', color:'white', padding:10, maxWidth:250, fontSize:16, fontWeight:'bold', borderTopLeftRadius:10, borderTopRightRadius:10, elevation:5}}>Close Form</Text>
       </TouchableOpacity>
       </View>
      <Picker
        style={{backgroundColor: 'white', height: 60}}
        mode="dropdown"
        selectedValue={selected}
        onValueChange={(itemValue, itemIndex) => setSelected(itemValue)}>
        <Picker.Item label="Select a Category" value={-10} />
        {formFields.map((item, index) => {
          return <Picker.Item label={item.title} value={index} key={index} />;
        })}
        <Picker.Item label="Review Form" value={100} />
      </Picker>
      <FormDisplay />
    </View>
  );
};

export default NewForm;

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
    width: 300,
  },
});
