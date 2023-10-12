import React,{useState, useRef,useEffect, useContext} from 'react';
// import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {useForm, Controller, reset, FormContext, useFormContext} from 'react-hook-form';
import {
  Alert,
  Button,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ActivityIndicator, RadioButton } from 'react-native-paper';
import { APP_API } from '../Constants';
import { useAuth } from '../contexts/Auth';
import axios from 'axios';
// import { GlobalContext } from '../contexts/GlobalContext';

// export const IconedButton = ({navigation}, x) => {
//   return (
//     <TouchableOpacity onPress={x => navigation.navigate(x)}>
//       <View>
//         <Image source={require('../resources/buttonIcons/Forms.png')} />
//       </View>
//     </TouchableOpacity>
//   );
// };

// export const IconedButton = props => {
//   const goto = props.path;
//   return (
//     <TouchableOpacity onPress={props => navigation.navigate(goto)}>
//       <Image source={require('../resources/buttonIcons/Forms.png')} />
//     </TouchableOpacity>
//   );
// };

//refactor to be more concise


export const currentDate = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth();
  let yyyy = today.getFullYear();

  const currentDate = dd + '/' + mm + '/' + yyyy;
  return currentDate;
};

//refactor to be more concise
export const currentTime = () => {
  let today = new Date();
  let hh = today.getHours();
  let mm = today.getMinutes();
  let ss = today.getSeconds();

  const time = hh + ':' + mm + ':' + ss;
  return time;
};

//Dashboard Clock Time for display
export const dashLocalTime = () => {
  return new Date().toLocaleTimeString();
};

// TIme and date formatters
export function timeConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
    time.splice (3,2);  // Remove full string match value
    // console.log(time);
  }
  return time.join (''); // return adjusted time or original string
}

export function timeConverter (dateJSON) {
  const date= new Date(dateJSON)
  let hh = date.getHours();
  let mm = date.getMinutes();

  const strTime = hh + ' Hours : ' + mm +' Minutes';
  return strTime;
}

export const jamaicanDateFormat = (dateParam) =>{
  const date = dateParam || new Date();
  let dd = date.getDate()<10?`0${date.getDate()}`:date.getDate();
  let mm = date.getMonth()<9?`0${date.getMonth()+1}`:date.getMonth()+1;
  let yyyy = date.getFullYear();
  const formattedDate = `${dd}/${mm}/${yyyy}`
  return formattedDate;
}


// weight conversions
export const poundsToTons = (lbs) => {
    var tons=lbs*	0.0004535924;
    return tons;
}
export const tonsToPounds = (tons) => {
  var lbs=tons*2204.62262185;
  return lbs;
}
export const tonsToKg = (tons) => {
  var kg=tons*1000;
  return kg;
}

export const poundsToKg = (lbs) => {
    var tons=poundsToTons(lbs);
    return tonsToKg(tons);
}


// Icons
export const RedTrashCan = () => {
  const location = require('../resources/RedTrashCan.png');
  return (
    <View>
      <Image style={{width:32, height:32}}  source={location} />
    </View>
    );
}
export const WhiteTick = ({ size=32 }) => {
  const location = require('../resources/approveForm.png');
  return (
      <View >
        <Image style={{width:size, height:size}} source={location} />
      </View>
  );
};
export const WhitePlus = ({ size=32 }) => {
  const location = require('../resources/WhitePlus.png');
  return (
      <View >
        <Image style={{width:size, height:size}} source={location} />
      </View>
  );
};
export const WhiteX = ({ size=32 }) => {
  const location = require('../resources/RejectForm.png');
  return (
      <View >
        <Image style={{width:size, height:size}} source={location} />
      </View>
  );
};
export const NewFormIcon = ({ size=32 }) => {
  const location = require('../resources/newForm.png');
  return (
      <View >
        <Image style={{width:size+5, height:size}} source={location} />
      </View>
  );
};
export const EditFormIcon = ({ size=32 }) => {
  const location = require('../resources/EditForm.png');
  return (
      <View >
        <Image style={{width:size, height:size}} source={location} />
      </View>
  );
};
export const ClockIcon = ({ size=32 }) => {
  const location = require('../resources/clock.png');
  return (
      <View >
        <Image style={{width:size, height:size}} source={location} />
      </View>
  );
};
export const UserProfileIcon = ({ size=32 }) => {
  const location = require('../resources/Profile.png');
  return (
      <View >
        <Image style={{width:size, height:size}} source={location} />
      </View>
  );
};
export const CalnderIcon = ({ size=32 }) => {
  const location = require('../resources/calender.png');
  return (
      <View >
        <Image style={{width:size, height:size}} source={location} />
      </View>
  );
}
// -----------

export const setMinDate = () =>{
  var date = new Date();
  // var firstDay= date.getDate() - date.getDay()
  var minDate= new Date(date.setDate(date.getDate()-6))
  return minDate;
}



// Form Parsing Functions

// This function separates the header values from the form categories and returns them in an object
export const organizeFormFields = (form) => {
  let retrievedForm;
  typeof form != "object" ? retrievedForm = JSON.parse(form) : retrievedForm = form; 
  let header={};
  let categories={};
  Object.keys(retrievedForm).map((key, idx) => {
    if(typeof retrievedForm[key] != "object"){
      header = {...header, ...{[key] : retrievedForm[key]}};
    }else{
      if (retrievedForm[key])
      categories = {...categories, [key]:retrievedForm[key]}
    }
  })
  header.Status=1
  // console.log(header);
  return {header:header, categories:categories};
}

export const categoryParse = (category) => {
  // console.log(typeof null);
  const styles={
      catLabel:{
        fontSize:22,
        fontWeight:'bold'
      },   
      subCat:{fontSize:20, fontWeight:'500',width:"100%", alignSelf:'center', backgroundColor:'#5d66ae', textAlign:'center', color:'white', marginLeft:-20,}
  }
  if (!category)
    return;
  else{
    return Object.keys(category).map((label, idx) =>{
      if(typeof category[label] == "object"){
        if (!category[label]) return;
        else
        return(
        <View key={idx}>
          <Text style={styles.subCat}>{label}</Text>
          <View style={{paddingBottom:20,}}>
            {categoryParse(category[label])}
          </View>
        </View>
        )
      }
      else {
        return <KeyValuePrint label={label} value={category[label]} />
      }
    });
  }
}


// This prints the values for the Review Form
export const KeyValuePrint = ({ label, value }) => {
  const styles={
    textLabel:{
      fontSize:16,
      fontWeight:'400',
      color:"#6c757d"
    },
    textValue:{
      fontSize:16,
      fontWeight:'500',
      color:"#22223b",
    },
  }

  return(
    <View >
      <Text style={styles.textLabel}>{label}: <Text style={styles.textValue}>{label.includes("Time")? printTimeField(label, value):value}</Text></Text>
    </View>
  )
}

export const printTimeField=(label, value)=>{
  if(label.includes("Feed Consumption")) return timeConverter(new Date(value).toJSON());
  else if (label.includes("Clocks on")) return value;
  return timeConvert(new Date(value).toLocaleTimeString());
}

// Queries - AXIOS
export const executeQuery = async (query) => {
  const [url, token="", method='GET', data={}, params={}] = query;

  const headers = {
    'Content-Type': "application/json",
    'Accept': "*/*",
    // Authorization: 'bearer ' + token,
  };

  const config = {
    method,
    url:url,
    // url:APP_API+url,
    // data,
    headers,
    // params,
  };

  try {
    console.log('trying...');
    // console.log(method);
    // console.log(config.url);
    const response = await axios(config);
    return response;
  } catch (error) {
    // console.log(error.request);
    throw error;
  }
};



// Form
export const defaultFields = {
  "Culls & Mortality": {
		"Culls - Male": "",
		"Mortality - Male": "",
		"Culls - Female": "",
		"Mortality - Female": "",
		"Dead on Arrival - Male": "",
		"Dead on Arrival - Female": ""
	},
	"Feed Inventory": {
		"Feed Brought Forward (lbs)": "",
		"Feed Recieved (lbs)": "",
		"Feed Transferred (lbs)": "",
		"Feed Spoilage (lbs)": "",
		"Days in Inventory": "",
		"Feed Start Time": "",
		"Feed Consumption Time": "",
		"Feed Consumed (lbs) -  Male": "",
		"Feed Consumed (lbs) -  Female": "",
		"Feed Distribution  - Male": "",
		"Feed Distribution  - Female": ""
	},
	"Miscellaneous": {
		'Water Consumption (gal)': "",
		"All Clocks on Time": "",
		"Lights": {
			"ON Time": "",
			"OFF Time": ""
		},
		"Lighting Hours": "",
		"Temperature": {
			"Morning Entry": "",
			"Morning Entry Time Captured": "",
			"Afternoon Entry": "",
			"Afternoon Entry Time Captured": ""
		},
		"Observation/Comments": ""
	},
	"Birds": {
		"Bird Weight (grams) - Male": "",
		"Bird Weight (grams) - Female": "",
		"Uniformity (%) - Male": "",
		"Uniformity (%) - Female": "",
		"Birds Added - Male": "",
		"Birds Added - Female": ""
	},
	"Eggs": {
		"Hatching Eggs": {
			"Hatching 1st Entry": "",
			"Hatching 1st Entry Time Captured": "",
			"Hatching 2nd Entry": "",
			"Hatching 2nd Entry Time Captured": "",
			"Hatching 3rd Entry": "",
			"Hatching 3rd Entry Time Captured": "",
			"Hatching 4th Entry": "",
			"Hatching 4th Entry Time Captured": "",
			"Hatching Eggs Total": ""
		},
		"Reject Eggs": {
			"Rejects 1st Entry": "",
			"Rejects 1st Entry Time Captured": "2023-03-15T15:17:57.120Z",
			"Rejects 2nd Entry": "",
			"Rejects 2nd Entry Time Captured": "2023-03-15T15:17:57.120Z",
			"Rejects 3rd Entry": "",
			"Rejects 3rd Entry Time Captured": "2023-03-15T15:17:57.120Z",
			"Rejects 4th Entry": "",
			"Rejects 4th Entry Time Captured": "2023-03-15T15:17:57.120Z",
			"Reject Eggs Total": ""
		},
		"Dumps": {
			"Dumps 1st Entry": "",
			"Dumps 1st Entry Time Captured": "",
			"Dumps 2nd Entry": "",
			"Dumps 2nd Entry Time Captured": "",
			"Dumps 3rd Entry": "",
			"Dumps 3rd Entry Time Captured": "",
			"Dumps 4th Entry": "",
			"Dumps 4th Entry Time Captured": "",
			"Dumps Total": ""
		},
		"Double Yolked Eggs": {
			"Double Yolked 1st Entry": "",
			"Double Yolked 1st Entry Time Captured": "",
			"Double Yolked 2nd Entry": "",
			"Double Yolked 2nd Entry Time Captured": "",
			"Double Yolked 3rd Entry": "",
			"Double Yolked 3rd Entry Time Captured": "",
			"Double Yolked 4th Entry": "",
			"Double Yolked 4th Entry Time Captured": "",
			"Double Yolked Eggs Total": ""
		},
		"Eggs Delivered": "",
		"Net Egg Weight (grams)": "",
		"Average Egg Weight (grams)": "",
		"Number of Eggs Weighed": "",
		"Egg Room Temperature": {
			"Egg Room 1st Entry": "",
			"Egg Room 1st Entry Time Captured": "",
			"Egg Room 2nd Entry": "",
			"Egg Room 2nd Entry Time Captured": ""
		},
		"Egg Room Humidity (%)": ""
	},
	"Vaccination": {
		"Type/Description": "",
		"Quantity": "",
		"Serial Number": ""
	}
};

export const CategoryController = ({ categorySchema, retrievedData, form, allowEdit=true, farm }) => {
  // consider implementing a load animation
  const [visible, setVisibility] = useState(true);
  const data = useRef({retrievedData});
  // console.log(form.getValues(categorySchema.title))
  return (
      <View>
          <TouchableOpacity onPress={() => {data.current={retrievedData:form.getValues(categorySchema.title)}; setVisibility(!visible); }}>
          <View 
              style={visible? 
                  {
                    justifyContent:'center',
                    paddingVertical: 20,
                    paddingTop: 30,
                  }:{
                    flexDirection:'row',
                    justifyContent:'space-between',
                    backgroundColor: '#282C50',
                    paddingVertical: 20,
                    paddingTop: 30,
                    paddingHorizontal:'5%'
                  }}>
              <Text
                style={visible? 
                  {
                  color: '#282C50',
                  fontSize: 26,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  // paddingVertical: 20,
                  // paddingTop: 30,
                }:{
                  // backgroundColor: '#282C50',
                  color:'white',
                  fontSize: 26,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  // marginLeft:'5%',
                  // paddingVertical: 20,
                  // paddingTop: 30,
                }}>
                {categorySchema.title.toUpperCase()} 
              </Text>
              {!visible && <WhitePlus size={32} />}
            </View>
          </TouchableOpacity>
          {visible && <Category categorySchema={categorySchema} retrievedData={data.current.retrievedData} form={form} allowEdit={allowEdit} farm={farm} />}
      </View>
  );
}

export const nth = function(d) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

export const Category = ({ categorySchema, retrievedData, form, allowEdit, farm }) => {
  useEffect(()=>{
    console.log('Welcome to the Category Component\'s UseEffect');
  },[]);
  // ToDo: Time fields need to be fixed- currently not saving state change or rerender
  const {
    register,
    control,
    handleSubmit,
    formState,
    formState: {errors, isValid},
    reset,
    getValues,
    setValue
  } = form;

  if (!retrievedData){
    // console.log();
    //   console.log(categorySchema, retrievedData);
    retrievedData={};
    // return;
  }
  // console.log('=================================');
  // console.log(farm?.type.toLowerCase());
  const globalEdit = typeof allowEdit == 'undefined'? true: allowEdit;
  const dateGlobal = new Date();
  // console.log(categorySchema.title);
  return(
    <ScrollView>
          <View style={styles.container}>
              {categorySchema.fields.map((item, index) => {
                if(farm?.type.toLowerCase() != "production"){
                  if (item.label.includes("Female"))
                    if (farm.house.includes("B"))
                    return;
                  if(item.label.includes("Male"))
                    if (!farm.house.includes("B"))
                      return;  
                }
                  
                // console.log(typeof item.farmType);                  
                // console.log(item);                  
                
                // Checking the retrieved data for a value matching this object key
                let defaultVal="";
                let baseFormLabel=categorySchema.title + "." +item.label;
                // console.log(baseFormLabel);
                Object.keys(retrievedData).map((field, fieldIndex) => {
                  if(item.label===field && retrievedData[field] !== ""){
                    defaultVal=retrievedData[field];
                    // if("Birds" === field){
                    //   console.log(field);
                    // }
                    // console.log(field);
                  }
                });
                // console.log(item.fields[subIndex].label);
                // console.log(retrievedData[item.label][subItem.label]);
                // console.log(item.fields[subIndex].type);
                // console.log(subItem.type);
                // console.log(validateInitValue(retrievedData[item.label][subItem.label], item.fields[subIndex].type));
                // console.log("===========================================");


                  //Nested Fields Conditional Function
                  if (typeof item.fields !== 'undefined') { // Check for fields array
                    //Since there in a fields array, further checks must be made to determine what type of field group is to be populated
                    //Nested Calculated (Tally Total) Fields Function
                    // if (item.type == 'multi-field') { //Refector this section to run in a loop and accept more fields
                    //     const [val1,setVal1] =useState(typeof defaultVal[item.fields[0].label] == "undefined" ? 0 : defaultVal[item.fields[0].label]);
                    //     const [date1, setDate1]= useState(typeof defaultVal[`${item.fields[0].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[0].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[0].label} Time Captured`]));
                    //     const [isVisible1, setIsVisible1]= useState(false);
                  
                    //     const [val2,setVal2] =useState(typeof defaultVal[item.fields[1].label] == "undefined" ? 0 : defaultVal[item.fields[1].label]);
                    //     const [date2, setDate2]= useState(typeof defaultVal[`${item.fields[1].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[1].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[1].label} Time Captured`]));
                    //     const [isVisible2, setIsVisible2]= useState(false);
                  
                    //     const [val3,setVal3] =useState(typeof defaultVal[item.fields[2].label] == "undefined" ? 0 : defaultVal[item.fields[2].label]);
                    //     const [date3, setDate3]=useState(typeof defaultVal[`${item.fields[2].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[2].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[2].label} Time Captured`]));
                    //     const [isVisible3, setIsVisible3]= useState(false);
                  
                    //     const [val4,setVal4] =useState(typeof defaultVal[item.fields[3].label] == "undefined" ? 0 : defaultVal[item.fields[3].label]);
                    //     const [date4, setDate4]= useState(typeof defaultVal[`${item.fields[3].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[3].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[3].label} Time Captured`]));
                    //     const [isVisible4, setIsVisible4]= useState(false);
                  
                    //     // console.log(defaultVal[item.fields[3].label])
                  
                    //     const [total,setTotal] =useState(val1+val2+val3+val4);

                    //     useEffect(()=>{setTotal(Number(val1)+Number(val2)+Number(val3)+Number(val4));})
                    //     useEffect(()=>{setValue(baseFormLabel+"."+item.label+" Total",total);},[total])
                    //     // parseFloat(defaultVal[subItem.label])>=0?""+defaultVal[subItem.label]:""
                    //     // console.log(defaultVal[item.fields[0].label]);
                    //     return (
                    //       <View style={{marginVertical: 12}} key={index}>
                    //  <Text style={{color: '#282C50', fontSize: 18}}>
                    //    {item.label}
                    //    <Text style={{color:'red'}}>{item.fields[0].regex.isRequired? " *":""}</Text>
                    //  </Text>
                    //  <View
                    //    style={{
                    //      height:100,
                    //      flexDirection: 'row',
                    //      justifyContent: 'space-between',
                    //      alignItems: 'center',
                    //    }}>
                    //      {/* Entry 1 */}
                    //      <View>  
                    //      {/* ERROR BORDER COLOR  */}
                    //      {/* <View style={{flexDirection:'column', height:'100%', alignContent:'flex-start', alignSelf:'flex-start'}}>  */}
                    //        <Controller        
                    //           control={control}   
                    //           defaultValue={parseFloat(defaultVal[item.fields[0].label])>0? defaultVal[item.fields[0].label]:parseFloat(defaultVal[item.fields[0].label])===0?0:null}  
                    //           name={baseFormLabel +"."+item.fields[0].label} 
                    //           rules={(()=>rules(item.fields[0].type, item.fields[0].regex))()}        
                    //           render={({field: {onChange, value1, onBlur}}) => (            
                    //             <TextInput  
                    //               editable={globalEdit}                  
                    //               style={styles.input}
                    //               placeholder="Enter 1st Entry"            
                    //               value={value1} 
                    //               defaultValue={parseFloat(defaultVal[item.fields[0].label])>0? defaultVal[item.fields[0].label]:parseFloat(defaultVal[item.fields[0].label])===0?"0":""}          
                    //               onBlur={onBlur}          
                    //               keyboardType="number-pad"  
                    //               onChangeText={value => {
                    //                console.log('this is onChange');
                    //                const newDate = new Date();
                    //                onChange(value); 
                    //                setValue(`${baseFormLabel}.${item.fields[0].label} Time Captured`, newDate.toJSON());
                    //                setValue(`${baseFormLabel}.${item.fields[0].label}`, Number(value));
                    //                setVal1(Number(value));
                    //                setDate1(newDate);
                    //                defaultVal[`${item.fields[0].label} Time Captured`]=newDate.toJSON();
                    //              }}          
                    //             />        
                    //           )} 
                    //        />
                    //        {/* {
                    //         //  (()=>{
                    //         //   console.log(categorySchema.title);
                    //         //   console.log(errors[`${categorySchema.title}`] &&errors[`${categorySchema.title}`][item.label] && errors[`${categorySchema.title}`][item.label][item.fields[0].label]);
                    //         //    let err, r;
                    //         //    err = errors[`${item.label}`]
                    //         //    err? r = Object.keys(err)[0]:"";
                    //         //    err? console.log("=================="+json.stringify(errors[baseFormLabel +"."+item.fields[0].label])):"";
                    //         //  })()
                    //        } */}
                    //        <Controller
                    //            control={control}
                    //            name={baseFormLabel + "." + item.fields[0].label + " Time Captured"}
                    //            defaultValue={date1}
                    //            value={date1}
                    //            render={({ field }) => (
                    //            <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible1(true)}  style={{padding:5, backgroundColor:'beige'}}>
                    //                <Text style={{color:'black'}}>Time: {timeConvert(date1.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                    //                {
                    //                  isVisible1 && 
                    //                  <DateTimePicker 
                    //                    value={date1} 
                    //                    defaultValue={date1} 
                    //                    is24Hour={false} 
                    //                    onChange={(event, selectedDate)=>{
                    //                      setIsVisible1(false);
                    //                      setDate1(selectedDate);
                    //                      setValue(`${baseFormLabel}.${item.fields[0].label} Time Captured`, date1.toJSON())
                    //                      defaultVal[`${item.fields[0].label} Time Captured`]=selectedDate;
                    //                      }
                    //                    } 
                    //                    mode="time" display="spinner" 
                    //                  />
                    //                }
                    //            </TouchableOpacity>
                    //            )}
                    //        />  
                    //        {console.log(baseFormLabel, defaultVal[`${item.fields[0].label} Time Captured`])}
                    //        { 
                    //          errors && errors[categorySchema.title] && errors[categorySchema.title][item.label] && errors[categorySchema.title][item.label][item.fields[0].label] && (
                    //            errors[categorySchema.title][item.label][item.fields[0].label].type != 'required' && 
                    //            (
                    //            <Text style={{ color: "red", flexWrap:'wrap' }}>
                    //              {errors[categorySchema.title][item.label][item.fields[0].label].type} ERORR
                    //            </Text>
                    //            )
                    //          )
                    //        }
                    //      </View>
                    //      {/* Entry 2 */}
                    //      <View>
                    //        <Controller        
                    //         control={control}  
                    //         defaultValue={""+defaultVal[item.fields[1].label]}        
                    //         name={baseFormLabel+"."+item.fields[1].label}  
                    //         rules={(()=>rules(item.fields[1].type))()}      
                    //         render={({field: {onChange, value2, onBlur}}) => (            
                    //           <TextInput
                    //             editable={globalEdit}                    
                    //             style={styles.input}
                    //             placeholder="Enter 2nd Entry"
                    //             value={value2}            
                    //             defaultValue={parseFloat(defaultVal[item.fields[1].label])>=0? ""+defaultVal[item.fields[1].label]:""}             
                    //             onBlur={onBlur}        
                    //             keyboardType="number-pad"    
                    //             onChangeText={value => {
                    //              onChange(value);
                    //              setValue(`${baseFormLabel}.${item.fields[1].label} Time Captured`, date2.toJSON());
                    //              setValue(`${baseFormLabel}.${item.fields[1].label}`, Number(value));
                    //              setVal2(Number(value));
                    //              setDate2(new Date());
                    //              defaultVal[`${item.fields[1].label} Time Captured`]=new Date().toJSON();
                    //            }}          
                    //           />        
                    //         )} 
                    //        />
                    //        <Controller
                    //         control={control}
                    //         name={baseFormLabel+"."+item.fields[1].label+ " Time Captured"}
                    //         defaultValue={date2} 
                    //         value={date2}
                    //         render={({ field }) => (
                    //         <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible2(true)}  style={{padding:5, backgroundColor:'beige'}}>
                    //          <Text style={{color:'black'}}>Time: {timeConvert(date2.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                    //          {
                    //           isVisible2 && 
                    //           <DateTimePicker 
                    //             value={date2} 
                    //             defaultValue={date2} 
                    //             is24Hour={false} 
                    //             onChange={(event, selectedDate)=>{
                    //                 setIsVisible2(false);
                    //                 setDate2(selectedDate);
                    //                 setValue(`${baseFormLabel}.${item.fields[1].label} Time Captured`, date2.toJSON())
                    //                 defaultVal[`${item.fields[1].label} Time Captured`]=selectedDate;
                    //               }
                    //             } 
                    //             mode="time" display="spinner" 
                    //           />
                    //          }
                    //         </TouchableOpacity>
                    //         )}
                    //        />
                    //        {/* {
                    //          (()=>{
                    //            let err, r;
                    //            err = errors[`${item.label}`]
                    //            err? r = Object.keys(err)[0]:"";
                    //            // err? console.log(err[r]):"";
                    //            err? console.log(errors[item.label][item.fields[1].label]):"";

                    //          })()
                    //        } */}
                    //        { 
                    //          errors && errors[categorySchema.title] && errors[categorySchema.title][item.label] && errors[categorySchema.title][item.label][item.fields[1].label] && (
                    //            errors[categorySchema.title][item.label][item.fields[1].label].type != 'required' && 
                    //            (
                    //            <Text style={{ color: "red", flexWrap:'wrap' }}>
                    //              {errors[categorySchema.title][item.label][item.fields[1].label].type} ERORR
                    //            </Text>
                    //            )
                    //          )
                    //        }
                    //      </View>
                    //      {/* Entry 3 */}
                    //      <View>
                    //        <Controller        
                    //           control={control}  
                    //           defaultValue={""+defaultVal[item.fields[2].label]}         
                    //           name={baseFormLabel+"."+item.fields[2].label}   
                    //           rules={(()=>rules(item.fields[2].type))()}     
                    //           render={({field: {onChange, value3, onBlur}}) => (            
                    //             <TextInput 
                    //               editable={globalEdit}
                    //               style={styles.input}                   
                    //               placeholder="Enter 3rd Entry" 
                    //               value={value3}            
                    //               defaultValue={parseFloat(defaultVal[item.fields[2].label])>=0? ""+defaultVal[item.fields[2].label]:""}             
                    //               onBlur={onBlur}  
                    //               keyboardType="number-pad"          
                    //               onChangeText={value => {
                    //                onChange(value);
                    //                setValue(`${baseFormLabel}.${item.fields[2].label} Time Captured`, date3.toJSON());
                    //                setValue(`${baseFormLabel}.${item.fields[2].label}`, Number(value));
                    //                setVal3(Number(value));
                    //                setDate3(new Date());
                    //                defaultVal[`${item.fields[2].label} Time Captured`]=new Date().toJSON();
                    //              }}          
                    //             />        
                    //           )} 
                    //        />
                    //        <Controller
                    //          control={control}
                    //          name={baseFormLabel+"."+item.fields[2].label + " Time Captured"}
                    //          defaultValue={date3}
                    //          value={date3}
                    //          render={({ field }) => (
                    //          <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible3(true)}  style={{padding:5, backgroundColor:'beige'}}>
                    //              <Text style={{color:'black'}}>Time: {timeConvert(date3.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                    //              {
                    //                isVisible3 && 
                    //                <DateTimePicker 
                    //                  value={date3} 
                    //                  defaultValue={date3} 
                    //                  is24Hour={false} 
                    //                  onChange={(event, selectedDate)=>{
                    //                       setIsVisible3(false);
                    //                       setDate3(selectedDate);
                    //                       setValue(`${baseFormLabel}.${item.fields[2].label} Time Captured`, date3.toJSON())
                    //                       defaultVal[`${item.fields[2].label} Time Captured`]=selectedDate;
                    //                    }
                    //                  } 
                    //                  mode="time" display="spinner" 
                    //                />
                    //              }
                    //          </TouchableOpacity>
                    //            )}
                    //        />
                    //        {/* {
                    //          (()=>{
                    //            let err, r;
                    //            err = errors[`${item.label}`]
                    //            err? r= Object.keys(err)[0]:"";
                    //            // err? console.log(err[r]):"";
                    //            err? console.log(errors[item.label][item.fields[2].label]):"";

                    //          })()
                    //        } */}
                    //        { 
                    //          errors && errors[categorySchema.title] && errors[categorySchema.title][item.label] && errors[categorySchema.title][item.label][item.fields[2].label] && (
                    //            errors[categorySchema.title][item.label][item.fields[2].label].type != 'required' && 
                    //            (
                    //            <Text style={{ color: "red", flexWrap:'wrap' }}>
                    //              {errors[categorySchema.title][item.label][item.fields[2].label].type} ERORR
                    //            </Text>
                    //            )
                    //          )
                    //        }
                    //      </View>
                    //      {/* Entry 4 */}
                    //      <View>
                    //        <Controller        
                    //           control={control} 
                    //           defaultValue={""+defaultVal[item.fields[3].label]}           
                    //           name={baseFormLabel+"."+item.fields[3].label}
                    //           rules={(()=>rules(item.fields[3].type))()}        
                    //           render={({field: {onChange, value4, onBlur}}) => (            
                    //             <TextInput 
                    //               editable={globalEdit}     
                    //               style={styles.input}              
                    //               placeholder="Enter 4th Entry" 
                    //               value={value4}            
                    //               defaultValue={parseFloat(defaultVal[item.fields[3].label])>=0? ""+defaultVal[item.fields[3].label]:""}             
                    //               onBlur={onBlur} 
                    //               keyboardType="number-pad"           
                    //               onChangeText={value => {
                    //                onChange(value);
                    //                setValue(`${baseFormLabel}.${item.fields[3].label} Time Captured`, date4.toJSON()); 
                    //                setValue(`${baseFormLabel}.${item.fields[3].label}`, Number(value)); 
                    //                setVal4(Number(value));
                    //                setDate4(new Date());
                    //                defaultVal[`${item.fields[3].label} Time Captured`]=new Date().toJSON();
                    //              }}          
                    //        />   
                    //           )} 
                    //        />
                    //        <Controller
                    //          control={control}
                    //          name={baseFormLabel+"."+item.fields[3].label+" Time Captured"}
                    //          defaultValue={date4} 
                    //          value={date4}
                    //          render={({ field }) => (
                    //          <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible4(true)}  style={{padding:5, backgroundColor:'beige'}}>
                    //              <Text style={{color:'black'}}>Time: {timeConvert(date4.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                    //              {
                    //                isVisible4 && 
                    //                <DateTimePicker 
                    //                  value={date4} 
                    //                  defaultValue={date4} 
                    //                  is24Hour={false} 
                    //                  onChange={(event, selectedDate)=>{
                    //                       setIsVisible4(false);
                    //                       setDate4(selectedDate);
                    //                       setValue(`${baseFormLabel}.${item.fields[3].label} Time Captured`, date4.toJSON())
                    //                       defaultVal[`${item.fields[3].label} Time Captured`]=selectedDate;
                    //                    }
                    //                  } 
                    //                  mode="time" display="spinner" 
                    //                />
                    //              }
                    //          </TouchableOpacity>
                    //            )}
                    //        />
                    //        {/* {
                    //          (()=>{
                    //            let err, r;
                    //            err = errors[`${item.label}`]
                    //            err? r= Object.keys(err)[0]:"";
                    //            err? console.log(err[r]):"";
                    //            err? console.log(errors[item.label][item.fields[3].label]):"";

                    //          })()
                    //        } */}
                    //        { 
                    //          errors && errors[categorySchema.title] && errors[categorySchema.title][item.label] && errors[categorySchema.title][item.label][item.fields[3].label] && (
                    //            errors[categorySchema.title][item.label][item.fields[3].label].type != 'required' && 
                    //            (
                    //            <Text style={{ color: "red", flexWrap:'wrap' }}>
                    //              {errors[categorySchema.title][item.label][item.fields[3].label].type} ERORR
                    //            </Text>
                    //            )
                    //          )
                    //        }
                    //      </View>

                    //      <Text style={{fontSize:18}}>= {total}</Text>
                    //  </View>
                    //     </View>
                    //   );
                    // }
                    // =====================================================================================================================
                    if (item.type === 'multi-field') {  
                      let total = 0;
                      const fieldFunc = item.fields.map((subItem, subIndex) => {
                          const initVal = validateInitValue(defaultVal[`${item.fields[subIndex].label}`], subItem.type);
                          const [valueState, setValueState] = useState(initVal);
                          const [date, setDate] = useState(defaultVal[`${item.fields[subIndex].label} Time Captured`] == "" ? new Date() : isNaN(new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`])) ? new Date() : new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`]));
                          const [isVisible, setIsVisible] = useState(false);
                          // console.log('initVal', initVal);
                          // console.log('valuestate', valueState);

                          // Add the initial value to the total
                          total += Number(valueState);

                          return(
                              <View style={{width:'24%'}} key={subIndex}>
                                <View>
                                <Controller
                                  key={subIndex}
                                  control={control}
                                  defaultValue={initVal}
                                  // value={valueState}
                                  name={baseFormLabel + '.' + subItem.label}
                                  // rules={{required:true}}
                                  rules={(()=>rules(item.fields[subIndex].type, item.fields[subIndex].regex))()}
                                  render={({ field: { onChange, onBlur, value }}) => {
                                    useEffect(() => {
                                      // console.log('use effect called');
                                      // console.log(value, typeof Number(value));
                                      const updatedTotal = Number(total) - Number(valueState) + Number(value);
                                      total = updatedTotal;
                                      setValue(baseFormLabel + '.' + item.label + ' Total', updatedTotal);
                                      
                                      // console.log(typeof value, value);
                                      if (value === 0)
                                        setValueState("0");
                                      else if (value) 
                                        setValueState(value+"");
                                      else
                                        setValueState("");
                                    }, [value]);
                      
                                    return (
                                      <>
                                        <TextInput
                                          editable={globalEdit}
                                          style={styles.input}
                                          placeholder={subItem.label}
                                          // defaultValue={initVal !== null ? '' + initVal : ''}
                                          onBlur={onBlur}
                                          onChangeText={value => {
                                            // console.log(typeof value, value);
                                            const newDate = new Date();
                                            onChange(value);
                                            setValue(`${baseFormLabel}.${subItem.label} Time Captured`, newDate.toJSON());
                                            value === "" ? setValue(`${baseFormLabel}.${subItem.label}`, null) : setValue(`${baseFormLabel}.${subItem.label}`, Number(value));
                                            // setValueState(Number(value));
                                            setDate(newDate);
                                            // defaultVal[`${item.fields[subIndex].label} Time Captured`] = newDate.toJSON();
                                            
                                            // // Calculate the updated total
                                            // const updatedTotal = Number(total) - Number(valueState) + Number(value);
                                            // total = updatedTotal;
                                            // setValue(baseFormLabel + '.' + item.label + ' Total', updatedTotal);
                                          }}
                                          value={valueState}
                                          keyboardType={subItem.type === 'int' || subItem.type === 'float' ? 'number-pad' : 'default'}
                                        />
                                      </>
                                    );
                                  }}
                                  />
                                  <Controller
                                    control={control}
                                    name={baseFormLabel + '.' +subItem.label+' Time Captured'}
                                    value={date}
                                    defaultValue={date}
                                    render={({ field:{onChange}}) => (
                                      <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible(true)} style={{paddingVertical:10, paddingHorizontal:5, backgroundColor:'beige'}}>
                                        <Text style={{color:'black', textAlign:'center'}}>Time: {timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                                        {
                                          isVisible && 
                                          <DateTimePicker 
                                            value={date} 
                                            is24Hour={false}
                                            defaultValue={defaultVal[subItem.label+" Time Captured"]}
                                            onChange={(event, selectedDate)=>{
                                              setIsVisible(false);
                                              setDate(selectedDate);
                                              // setValue(`${baseFormLabel}.${subItem.label} Time Captured`, date.toJSON())
                                              onChange(selectedDate)
                                              }
                                            } 
                                            mode="time" display="spinner" 
                                          />
                                        }
                                      </TouchableOpacity>
                                    )}
                                  />
                                  </View>
                                  { 
                                    errors && errors[categorySchema.title] && errors[categorySchema.title] && errors[categorySchema.title][item.label] && errors[categorySchema.title][item.label][subItem.label] && (
                                      ( errors[categorySchema.title][item.label][subItem.label].type != 'required') && <Text style={{ color: "red" }}>
                                         {errors[categorySchema.title][item.label][subItem.label].type} ERORR
                                      </Text>
                                    )
                                  }
                              </View>
                          );
                      }); 
                      // const total = fieldFunc.reduce((acc, field) => acc + Number(field.props.children[0].props.value), 0);
                      // const total = fieldFunc.reduce((acc, field) => acc + field.valueState, 0);
                    
                      useEffect(() => {
                        setValue(baseFormLabel + '.' + item.label + ' Total', total);
                      }, [total]);   
                      
                      // console.log(fieldFunc[0].props.children[0].props);            
                      return(
                        <View style={{marginVertical: 12}} key={index}>
                          <Text style={{color: '#282C50', fontSize: 18}}>
                            {item.label}
                            <Text style={{color:'red'}}>{item.fields[0].regex.isRequired? " *":""}</Text>
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                              {fieldFunc}
                          </View>
                          <Text>Total {item.label}: {total}</Text>
                        </View>
                      )
                    }
                    // =====================================================================================================================
                    // if (item.type === 'multi-field') {
                      
                    // return(
                    //   <View style={{marginVertical: 12}} key={index}>
                    //     <Text style={{color: '#282C50', fontSize: 18}}>
                    //       {item.label}
                    //       <Text style={{color:'red'}}>{item.fields[0].regex.isRequired? " *":""}</Text>
                    //     </Text>
                    //     <View
                    //       style={{
                    //         flexDirection: 'row',
                    //         justifyContent: 'space-between',
                    //         alignItems: 'center',
                    //       }}>
                    //       {
                    //         item.fields.map((subItem, subIndex) => {
                    //             const [date, setDate] = useState(defaultVal[`${item.fields[subIndex].label} Time Captured`] == "" ? new Date() : isNaN(new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`])) ? new Date() : new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`]));
                    //             const [isVisible, setIsVisible] = useState(false);
                    //             return(
                    //               <View style={{width:'24%'}} key={subIndex}>
                    //                 <Controller
                    //                   key={subIndex}
                    //                   control={control}
                    //                   defaultValue={validateInitValue(defaultVal[`${item.fields[subIndex].label}`], subItem.type)}
                    //                   name={baseFormLabel + '.' + subItem.label}
                    //                   rules={(()=>rules(subItem.type))()}
                    //                   render={({field: {onChange, onBlur, value}}) => (
                    //                     <>
                    //                       <TextInput
                    //                         editable={globalEdit}
                    //                         style={styles.input}
                    //                         placeholder={subItem.label}
                    //                         defaultValue={parseFloat(defaultVal[subItem.label])>=0?""+defaultVal[subItem.label]:""}
                    //                         // defaultValue={defaultVal[subItem.label]? ""+defaultVal[subItem.label]:""}
                    //                         onBlur={onBlur}
                    //                         // onChangeText={(e) => {
                    //                         //   onChange(e); 
                    //                         //   if(e !== ""){
                    //                         //     setValue(`${baseFormLabel}.${subItem.label} Time Captured`, (new Date).toJSON()); 
                    //                         //     setValue(`${baseFormLabel}.${subItem.label}`, parseFloat(e));
                    //                         //   }else{
                    //                         //     defaultVal[subItem.label]=e
                    //                         //   }
                    //                         // }}
                    //                         onChangeText={value => {
                    //                           // console.log('this is onChange');
                    //                           const newDate = new Date();
                    //                           onChange(value); 
                    //                           setValue(`${baseFormLabel}.${subItem.label} Time Captured`, newDate.toJSON());
                    //                           setValue(`${baseFormLabel}.${subItem.label}`, Number(value));
                    //                           // setVal1(Number(value));
                    //                           setDate(newDate);
                    //                           defaultVal[`${item.fields[subIndex].label} Time Captured`]=newDate.toJSON();
                    //                         }}  
                    //                         value={value}
                    //                         keyboardType={(subItem.type=='int' || subItem.type=='float') ? "number-pad":"default"}
                    //                         />
                    //                     </>
                    //                   )}
                    //                   />
                    //                   <Controller
                    //                     control={control}
                    //                     name={baseFormLabel + '.' +subItem.label+' Time Captured'}
                    //                     value={date}
                    //                     defaultValue={date}
                    //                     render={({ field:{onChange}}) => (
                    //                     <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible(true)} style={{paddingVertical:10, paddingHorizontal:5, backgroundColor:'beige'}}>
                    //                         <Text style={{color:'black', textAlign:'center'}}>Time: {timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                    //                         {
                    //                           isVisible && 
                    //                           <DateTimePicker 
                    //                             value={date} 
                    //                             is24Hour={false}
                    //                             defaultValue={defaultVal[subItem.label+" Time Captured"]}
                    //                             onChange={(event, selectedDate)=>{
                    //                               setIsVisible(false);
                    //                               setDate(selectedDate);
                    //                               // setValue(`${baseFormLabel}.${subItem.label} Time Captured`, date.toJSON())
                    //                               onChange(selectedDate)
                    //                               }
                    //                             } 
                    //                             mode="time" display="spinner" 
                    //                           />
                    //                         }
                    //                     </TouchableOpacity>
                    //                       )}
                    //                   />
                    //                   { 
                    //                     errors && errors[categorySchema.title] && errors[categorySchema.title] && errors[categorySchema.title][item.label] && errors[categorySchema.title][item.label][subItem.label] && (
                    //                       ( errors[categorySchema.title][item.label][subItem.label].type != 'required') && <Text style={{ color: "red" }}>
                    //                          {errors[categorySchema.title][item.label][subItem.label].type} ERORR
                    //                       </Text>
                    //                     )
                    //                   }
                    //               </View>
                    //             );
                    //         })
                    //       }
                    //     </View>
                    //   </View>
                    // )}
                    // =====================================================================================================================
                    // if (item.type === 'multi-field') {
                    //   const fields = item.fields.map((field, index) => {
                    //     const defaultValue = defaultVal[field.label] !== undefined ? defaultVal[field.label] : 0;
                    //     const defaultTime = typeof defaultVal[`${item.fields[0].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[0].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[0].label} Time Captured`])
                    
                    //     const [value, setValue] = useState(defaultValue);
                    //     const [date, setDate] = useState(new Date());
                    //     const [isVisible, setIsVisible] = useState(false);
                    
                    //     useEffect(() => {
                    //       setValue(typeof defaultValue === 'number' ? defaultValue : 0);
                    //     }, [defaultValue]);
                    
                    //     useEffect(() => {
                    //       setValue(baseFormLabel + '.' + field.label, value);
                    //       const updatedDate = new Date(date);
                    //       const updatedDateJSON = updatedDate.toJSON();
                    //       setDate(baseFormLabel + '.' + field.label + ' Time Captured', updatedDate);
                    //       defaultVal[field.label] = Number(value);
                    //       defaultVal[`${field.label} Time Captured`] = updatedDateJSON;
                    //     }, [value, date]);
                    //       console.log(date);
                    //     return (
                    //       <View key={index} style={{flex:0.9}}>
                    //         {/* <View style={{ height: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}> */}
                    //           <View>
                    //             <Controller
                    //               control={control}
                    //               defaultValue={defaultValue > 0 ? defaultValue : null}
                    //               name={baseFormLabel + '.' + field.label}
                    //               rules={(() => rules(field.type, field.regex))()}
                    //               render={({ field: { onChange, value, onBlur } }) => (
                    //                 <TextInput
                    //                   editable={globalEdit}
                    //                   style={[styles.input, {marginRight:10}]}
                    //                   placeholder="Enter Entry"
                    //                   value={value}
                    //                   defaultValue={defaultValue > 0 ? defaultValue.toString() : ''}
                    //                   onBlur={onBlur}
                    //                   keyboardType="number-pad"
                    //                   onChangeText={value => {
                    //                     const newDate = new Date();
                    //                     onChange(value);
                    //                     setValue(Number(value));
                    //                     setDate(newDate);
                    //                     defaultVal[field.label] = Number(value);
                    //                     defaultVal[`${field.label} Time Captured`] = newDate.toJSON();
                    //                   }}
                    //                 />
                    //               )}
                    //             />
                    //           <Controller
                    //            control={control}
                    //            name={baseFormLabel + "." + item.fields[0].label + " Time Captured"}
                    //            defaultValue={date}
                    //            value={date}
                    //            render={({ field }) => (
                    //            <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible(true)}  style={{padding:5, backgroundColor:'beige'}}>
                    //                <Text style={{color:'black'}}>Time: {timeConvert(defaultTime.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                    //                {
                    //                  isVisible && 
                    //                  <DateTimePicker 
                    //                    value={date} 
                    //                    defaultValue={date} 
                    //                    is24Hour={false} 
                    //                    onChange={(event, selectedDate)=>{
                    //                      setIsVisible(false);
                    //                      setDate(selectedDate);
                    //                      setValue(`${baseFormLabel}.${item.fields[0].label} Time Captured`, date.toJSON())
                    //                     //  defaultVal[`${item.fields[0].label} Time Captured`]=selectedDate;
                    //                      }
                    //                    } 
                    //                    mode="time" display="spinner" 
                    //                  />
                    //                }
                    //            </TouchableOpacity>
                    //            )}
                    //        /> 
                    //             {/* ...additional code for time captured and error handling */}
                    //           {/* </View> */}
                    //         </View>
                    //       </View>
                    //     );
                    //   });
                    
                    //   const total = fields.reduce((acc, field) => acc + field.value, 0);
                    
                    //   useEffect(() => {
                    //     setValue(baseFormLabel + '.' + item.label + ' Total', total);
                    //   }, [total]);
                    
                    //   return (
                    //     <View style={{ marginVertical: 12 }}>
                    //         <Text style={{ color: '#282C50', fontSize: 18 }}>
                    //           {item.label}
                    //           <Text style={{ color: 'red' }}>{item.fields[0].regex.isRequired ? ' *' : ''}</Text>
                    //         </Text>
                    //       <View style={{
                    //         flex:1,
                    //         flexDirection: 'row',
                    //         justifyContent: 'space-between',
                    //         alignItems: 'center',
                    //       }}>
                    //         {fields}
                    //       </View>
                    //       <Text style={{ fontSize: 18 }}>Total {item.label}: {total}</Text>
                    //     </View>
                    //   );
                    // }
                    
                      else if(item.type == 'multi-time-only'){                     
                      return(
                        <View style={{marginVertical: 12}} key={index}>
                          <Text style={{color: '#282C50', fontSize: 18}}>
                            {item.label}
                            <Text style={{color:'red'}}>{item.fields[0].regex.isRequired? " *":""}</Text>
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            {item.fields.map((subItem, subIndex) => {
                              const [l,setL]=useState(item.fields[subIndex].label === "" || isNaN(new Date(defaultVal[`${item.fields[subIndex].label}`])) ?true:false);
                              const [date, setDate] = useState(defaultVal[`${item.fields[subIndex].label}`] == "" ? dateGlobal : isNaN(new Date(defaultVal[`${item.fields[subIndex].label}`])) ? dateGlobal : new Date(defaultVal[`${item.fields[subIndex].label}`]));
                              const [isVisible, setIsVisible] = useState(false);
                              return(
                                <View style={{width:'40%'}} key={subIndex}>
                                  <Text style={{fontWeight:'500', fontSize:16}}>{subItem.label.toUpperCase()}:</Text>
                                  <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible(true)} style={{ paddingVertical:20, paddingHorizontal:10, backgroundColor:'beige', fontSize:18}}>
                                    <Text style={{color:'black', fontSize:16, textAlign:'center'}}>{l?" -  Select Time  - ":timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                                    <Controller
                                      render={({ field:{ onChange }}) => (
                                        <>
                                            {
                                              isVisible && 
                                              <DateTimePicker 
                                                style={{flex:1}}
                                                value={date} 
                                                is24Hour={false}
                                                defaultValue={defaultVal[subItem.label] || date}
                                                // onChange={onChange}
                                                onChange={(event, selectedDate)=>{
                                                  setIsVisible(false);
                                                  setDate(selectedDate);
                                                  if(l)
                                                    setL(false);
                                                  // setValue(`${baseFormLabel}.${subItem.label}`, selectedDate.toJSON())
                                                  onChange(selectedDate);
                                                  }
                                                } 
                                                mode="time" display="spinner" 
                                              />
                                            }
                                          {/* {console.log(getValues(`${baseFormLabel}.${subItem.label}`))} */}
                                          {/* {console.log("date:  "+JSON.stringify(getValues(baseFormLabel))+ " but ... "+date)} */}
                                        </>
                                      )}
                                      control={control}
                                      // type={"date"}
                                      name={baseFormLabel + '.' +subItem.label}
                                      value={date}
                                      rules={{ required: true }}
                                      // rules={{ required: true, valueAsDate: true, validate:(value, formValues) => console.log("fsadfsdf"+value)}}
                                      defaultValue={defaultVal[subItem.label] || "" } 
                                    />
                                  </TouchableOpacity>
                                  { 
                                    errors 
                                    && errors[baseFormLabel] && errors[baseFormLabel][subItem.label] 
                                    && (
                                          <Text style={{ color: "red" }}>
                                         {errors[baseFormLabel][subItem.label].type}
                                          ERORR
                                      </Text>
                                    )
                                  }
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      )
                    }else{
                      //Nested Time Fields Function
                      return(
                        <View style={{marginVertical: 12}} key={index}>
                          <Text style={{color: '#282C50', fontSize: 18}}>
                            {item.label}
                            <Text style={{color:'red'}}>{item.fields[0].regex.isRequired? " *":""}</Text>
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                                {item.fields.map((subItem, subIndex) => {
                                  const [date, setDate] = useState(defaultVal[`${item.fields[subIndex].label} Time Captured`] == "" ? new Date() : isNaN(new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`])) ? new Date() : new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`]));
                                  const [isVisible, setIsVisible] = useState(false);
                                  return(
                                    <View style={{width:'40%'}} key={subIndex}>
                                      <Controller
                                        key={subIndex}
                                        control={control}
                                        defaultValue={validateInitValue(defaultVal[subItem.label], subItem.type)}
                                        name={baseFormLabel + '.' + subItem.label}
                                        rules={(()=>rules(subItem.type))()}
                                        render={({field: {onChange, onBlur, value}}) => (
                                          <>
                                            <TextInput
                                              editable={globalEdit}
                                              style={styles.input}
                                              placeholder={subItem.label}
                                              defaultValue={parseFloat(defaultVal[subItem.label])>=0?""+defaultVal[subItem.label]:""}
                                              // defaultValue={defaultVal[subItem.label]? ""+defaultVal[subItem.label]:""}
                                              onBlur={onBlur}
                                              onChangeText={(e) => {onChange(e); if(e !== ""){setDate(new Date());setValue(`${baseFormLabel}.${subItem.label} Time Captured`, (new Date).toJSON()); setValue(`${baseFormLabel}.${subItem.label}`, parseFloat(e));}else{defaultVal[subItem.label]=e}}}
                                              value={value}
                                              keyboardType={(subItem.type=='int' || subItem.type=='float') ? "number-pad":"default"}
                                              />
                                          </>
                                        )}
                                        />
                                        <Controller
                                          control={control}
                                          name={baseFormLabel + '.' +subItem.label+' Time Captured'}
                                          value={date}
                                          defaultValue={date}
                                          render={({ field:{onChange}}) => (
                                          <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible(true)} style={{paddingVertical:10, paddingHorizontal:5, backgroundColor:'beige'}}>
                                              <Text style={{color:'black', textAlign:'center'}}>Time: {timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                                              {
                                                isVisible && 
                                                <DateTimePicker 
                                                  value={date} 
                                                  is24Hour={false}
                                                  defaultValue={defaultVal[subItem.label+" Time Captured"]}
                                                  onChange={(event, selectedDate)=>{
                                                    setIsVisible(false);
                                                    setDate(selectedDate);
                                                    // setValue(`${baseFormLabel}.${subItem.label} Time Captured`, date.toJSON())
                                                    onChange(selectedDate)
                                                    }
                                                  } 
                                                  mode="time" display="spinner" 
                                                />
                                              }
                                          </TouchableOpacity>
                                            )}
                                        />
                                        { 
                                          errors && errors[categorySchema.title] && errors[categorySchema.title] && errors[categorySchema.title][item.label] && errors[categorySchema.title][item.label][subItem.label] && (
                                            ( errors[categorySchema.title][item.label][subItem.label].type != 'required') && <Text style={{ color: "red" }}>
                                               {errors[categorySchema.title][item.label][subItem.label].type} ERORR
                                            </Text>
                                          )
                                        }
                                    </View>
                                  );
                              })}
                          </View>
                        </View>
                      )
                    }             
                  } else {
                    //Radio Button Field Function
                    if(item.type == 'option'){
                      const [val,setVal] = useState(defaultVal?defaultVal:null);
                      return(
                        <View style={{marginVertical: 12}} key={index}>
                          <Text style={{color: '#282C50', fontSize: 18}}>
                            {item.label}
                            <Text style={{color:'red'}}>{item.regex.isRequired? " *":""}</Text>
                          </Text>
                          <Controller
                            control={control}
                            name={baseFormLabel}
                            defaultValue={val}
                            rules={rules(item.type, item.regex)}
                            render={({field: {onChange, value}}) => (
                              <>
                                <RadioButton.Group
                                  onValueChange={(val)=>{setVal(val);setValue(`${baseFormLabel}`, val); onChange(val)}}
                                  value={value}
                                  >
                                  <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <RadioButton status={val == item.options[0]? "checked" : "unchecked"} value={item.options[0]}></RadioButton>
                                    <Text style={{fontSize:16}}>{item.options[0]}</Text>
                                  </View>
                                  <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <RadioButton status={val == item.options[1]? "checked" : "unchecked"} value={item.options[1]}></RadioButton>
                                    <Text style={{fontSize:16}}>{item.options[1]}</Text>
                                  </View>
                                </RadioButton.Group>
                              </>
                            )}
                          />
                          {
                            errors && errors[baseFormLabel] && (
                               (<Text style={{ color: "red" }}>
                                {errorMessage(errors[categorySchema.title][item.label].type)}
                                {console.log(errors)}
                              </Text>)
                            )
                          }
                        </View>
                      )
                    }else if(item.type == 'time'){
                      const [l,setL]=useState(defaultVal === "" || typeof defaultVal == "undefined"?true:false);
                      const [date,setDate]=useState((defaultVal === "" || typeof defaultVal == "undefined" ? dateGlobal: new Date(defaultVal)));
                      const [isVisible,setIsVisible]=useState(false);
                      return(
                        <View style={{marginVertical: 12}} key={index}>
                          <Text style={{color: '#282C50', fontSize: 18}}>
                            {item.label}
                            <Text style={{color:'red'}}>{item.regex.isRequired? " *":""}</Text>
                          </Text>
                          <Controller
                            render={({ field:{onChange} }) => (
                              <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible(true)}  style={{padding:20, backgroundColor:'beige'}}>
                                <Text style={{color:'black'}}>{l?" -  Select Time  - ":`${timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}`}</Text>
                                {
                                  isVisible && 
                                  <DateTimePicker 
                                  value={date} 
                                  defaultValue={defaultVal || date} 
                                  is24Hour={false} 
                                  onChange={(event, selectedDate)=>{
                                    setIsVisible(false);
                                    setDate(selectedDate);
                                    setL(false);
                                    // setValue(`${baseFormLabel}`, selectedDate.toJSON());
                                    // defaultVal=selectedDate;
                                    onChange(selectedDate);
                                  }
                                } 
                                mode="time" display="spinner" 
                                />
                              }
                            </TouchableOpacity>
                            )}
                            control={control}
                            name={baseFormLabel}
                            defaultValue={defaultVal || ""}
                            value={date}
                            rules={rules(item.type, item.regex)}
                          /> 
                      </View>
                    );
                    }else if(item.type == 'justTime'){
                      var d;
                      var label;
                      if (defaultVal == "" || typeof defaultVal == 'undefined'){ label=true;d=dateGlobal; d.setHours(0,0,0,0); }
                      else {label=false;d=new Date(defaultVal);}
                      const [l,setL]=useState(label);
                      const [date,setDate]=useState(d);
                      const [isVisible,setIsVisible]=useState(false);
                      return(
                        <View style={{marginVertical: 12}} key={index}>
                          <Text style={{color: '#282C50', fontSize: 18}}>
                            {item.label}
                            <Text style={{color:'red'}}>{item.regex.isRequired? " *":""}</Text>
                          </Text>
                          <Controller
                            render={({ field:{onChange} }) => (
                              <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible(true)}  style={{padding:20, backgroundColor:'beige'}}>
                                <Text style={{color:'black'}}>{l?" -  Select Time  - ":`${timeConverter(date)}`}</Text>
                                {
                                  isVisible && 
                                  <DateTimePicker 
                                  value={date} 
                                  is24Hour={true} 
                                  onChange={(event, selectedDate)=>{
                                    setIsVisible(false);
                                    setDate(selectedDate);
                                    setL(false);
                                    // setValue(`${baseFormLabel}`, selectedDate.toJSON())
                                    onChange(selectedDate);
                                  }
                                } 
                                mode="time" display="spinner" 
                                />
                              }
                            </TouchableOpacity>
                            )}
                      control={control}
                      name={baseFormLabel}
                      defaultValue={defaultVal || ""}
                      value={date}
                      rules={rules(item.type, item.regex)}
                            /> 
                        </View>
                      );
                    }else{ 
                      //Typical Input Field Function  
                      const defaultVal1=useRef(validateInitValue(retrievedData[item.label])); 
                      const isDescription = item.type ==="description"?true:false;
                      const MAX_LENGTH = maxLengthFilter(item.type);
                      const [charsLeft, setCharsLeft] = useState(MAX_LENGTH);
                      
                      return(
                      <View style={{marginVertical: 12}} key={index}>
                        <Text style={{color: '#282C50', fontSize: 18}}>
                          {item.label}
                          <Text style={{color:'red'}}>{item.regex.isRequired? " *":""}</Text>
                        </Text>
                        {isDescription && <Text>Characters left: <Text style={{color:charsLeft < 10?"red":'', fontWeight:'bold'}}>{charsLeft}</Text></Text>}
                        <Controller
                          control={control}
                          name={baseFormLabel}
                          defaultValue={defaultVal1.current}
                          rules={(()=>rules(item.type, item.regex))()}
                          render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                              editable={globalEdit}
                              style={isDescription? styles.description:styles.input}
                              placeholder={item.label}
                              onBlur={onBlur}
                              maxLength={MAX_LENGTH}
                              onChangeText={(e) => {
                                (item.type=='float' || item.type=='int') ? (()=>{
                                  // console.log("is not float: "+isNaN(parseFloat(e)));
                                  // console.log("float value: "+parseFloat(e));
                                  onChange(e);
                                  if(isNaN(parseFloat(e))){
                                     defaultVal1.current=e;
                                  }else{
                                    setValue(`${baseFormLabel}`, parseFloat(e));
                                  }
                                })()
                                :(()=>{
                                  setCharsLeft(MAX_LENGTH - e.length);
                                  onChange(e)
                                })()
                              }}
                              value={value}
                              defaultValue={defaultVal1.current !== null? ""+defaultVal1.current:""}
                              // defaultValue={""+defaultVal1.current}
                              multiline={item.type=="description"? true : false}
                              keyboardType={(item.type=='int' || item.type=='float') ? "number-pad":"default"}
                            />
                          )}
                        />
                        {
                          errors && errors[categorySchema.title] && errors[categorySchema.title][item.label] && (
                            (errors[categorySchema.title][item.label].type != 'required') && (<Text style={{ color: "red" }}>
                              {errorMessage(errors[categorySchema.title][item.label].type)}
                            </Text>)
                          )
                        }
                      </View>
                      );
                    }
                  }
              })}
              {/* {submitView(categorySchema.title, isValid)} */}
              {/* {console.log("Errors:" + JSON.stringify(errors)+"\n\n")}
              {console.log(categorySchema.title+ ":  "+isValid)} */}
          </View>
      </ScrollView>
  );

}

const rules = (type, regex={}) => {

  if(type === 'int'){
    // console.log('int');
    return({
      pattern:/^[0-9]*$|^NULL$/,
      required: regex?.isRequired || false,
      min: regex.min || 0,
      max: regex.max || 10000,
    });
  }
  else if(type === 'float'){
    // console.log('float');
    return({
      pattern: /^[+-]?([0-9]*[.])?[0-9]+$/,
      required: regex?.isRequired || false,
      min:regex.min || 0,
      max:regex.max || 10000,
    });
  }
  else if(type === 'time'){
    return ({
      required: true,
      valueAsDate: true,
      // validate:((value, formValues)=> console.log(value, formValues))(),
    })
  }
  else{
    // console.log('string');
    // console.log(type, regex.isRequired);
    return ({
      required: regex?.isRequired || false,
    })
  }
}

const maxLengthFilter = (type) => {
  if(type === 'int'){
    return 10;
  }
  else if(type === 'float'){
    return 10;
  }
  else if(type === 'description'){
    return 80;
  }
  else
    return null;
}

const errorMessage = (type, regex={}) => {
  if(type === 'min'){
    return "The entered value is too SMALL";
  }
  else if(type === 'max'){
    return"The entered value is too LARGE";
  }
  else if(type === 'pattern'){
    return "Please check value's FORMAT";
  }
  else{
    return "This field is required for submission"
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 20,
  },
  header:{
    color: '#282C50',
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
});

export const FarmSummary = ({ props }) => {
  const { Farm, House} = props;
  // console.log("========================== Farm =====================");
  // console.log(Farm);
  // console.log("========================== HOUSE ====================");
  // console.log(House);

  const RenderItem = ({label, value, suffix=""}) => {
    return(
      value && <View
        style={{
        alignItems: 'center',
        flexDirection: 'row',
        }}>
        <Text style={{fontSize: 18}}>{label}</Text>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'black',
            marginLeft: 5,
            fontSize: 18,
          }}>
          {value} {suffix}
        </Text>
      </View>
    )
  }

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
          <Text style={{fontSize: 18}}>Farm Type:</Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              marginLeft: 5,
              fontSize: 18,
            }}>
            {Farm.type}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{fontSize: 18}}>Farm Name: </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              marginLeft: 5,
              fontSize: 18,
            }}>
            {Farm.name}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{fontSize: 18}}>House Selected: </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              marginLeft: 5,
              fontSize: 18,
            }}>
            {House.name}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingTop:10,
          flexWrap:'wrap'
        }}>
        <RenderItem label={"Flock Number:"} value={House.flockNumber} />
        <RenderItem label={"Flock Started Male:"} value={House.flockStartedMale} />
        <RenderItem label={"Flock Started Female:"} value={House.flockStartedFemale} />
        <RenderItem label={"Flock Housed Male:"} value={House.flockHousedMale} />
        <RenderItem label={"Flock Housed Female:"} value={House.flockHousedFemale} />
        <RenderItem label={"Birds Brought Forward Male:"} value={House.birdsBroughtForwardMale} />
        <RenderItem label={"Birds Brought Forward Female:"} value={House.birdsBroughtForwardFemale} />
        <RenderItem label={"Days in Inventory:"} value={Farm.DaysInInventory} />
        <RenderItem label={"Feed Recieved:"} value={Farm.FeedReceived} suffix={"lbs"}/>
        <RenderItem label={"Flock Age:"} value={House.flockAge} suffix={"Weeks"}/>
        <RenderItem label={"Flock Breed:"} value={House.flockBreed} />
      </View>
    </View>
  );
};

// export const IPBRadioButton =({props})=>{
//   const [buttonValue, setButtonValue] = useState(null);
//   return(
//     <View style={{marginVertical: 12}} key={index}>
//       <Text style={{color: '#282C50', fontSize: 18}}>
//         {item.label}
//       </Text>
//       <Controller
//         control={control}
//         name={baseFormLabel}
//         defaultValue={defaultVal}
//         rules={()=>}
//         render={({field: {onChange, value}}) => (
//           <>
//             <RadioButton.Group
//               onValueChange={onChange}
//               value={value}
//               >
//               <View style={{flexDirection:'row', alignItems:'center'}}>
//                 <RadioButton status={defaultVal == item.options[0]? "checked" : "unchecked"} value={item.options[0]}></RadioButton>
//                 <Text style={{fontSize:16}}>{item.options[0]}</Text>
//               </View>
//               <View style={{flexDirection:'row', alignItems:'center'}}>
//                 <RadioButton status={defaultVal == item.options[1]? "checked" : "unchecked"} value={item.options[1]}></RadioButton>
//                 <Text style={{fontSize:16}}>{item.options[1]}</Text>
//               </View>
//             </RadioButton.Group>
//           </>
//         )}
//       />
//     </View>
//   )
// }

// TO complete for HOME PAGE refactor
const RoundButton = ({ path, icon, title }) => (
  <TouchableOpacity style={{ width: 120, margin: 10 }} onPress={() => navigation.navigate(path, { farms })}>
    <LinearGradient colors={['#5c9ead', '#326273']} style={{ height: 120, width: 120, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 60 }}>
      {icon}
    </LinearGradient>
    <Text style={{ textAlign: 'center', color: '#282C50', fontSize: 16, fontWeight: '400' }}>{title}</Text>
  </TouchableOpacity>
);

const ButtonPanel = () => {
  if (role === APP_ROLES[0]) {
    return (
      <View style={{ backgroundColor: '#EFF5FF', justifyContent: 'space-evenly', alignContent: 'center', elevation: 10 }}>
        <View>
          <Text style={{ textAlign: 'center', fontSize: 20, color: '#282C50', marginTop: 10, fontWeight: 'bold' }}>FORMS PANEL</Text>
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#8AB4CD', fontWeight: '400' }}>All form actions can be done here</Text>
        </View>
        <View style={{ backgroundColor: '#EFF5FF', marginBottom: 10, justifyContent: 'space-evenly', flexDirection: 'row', alignContent: 'center' }}>
          <RoundButton path="Farm House Select" icon={<NewFormIcon size={68} />} title="Create Form" />
          <RoundButton path="Edit Form Select" icon={<EditFormIcon size={68} />} title="Edit Form" />
          <RoundButton path="Review Form" icon={<ReviewFormIcon size={68} />} title="Review Form" />
          <RoundButton path="Rejected Forms" icon={<RejectedFormsIcon size={68} />} title="Rejected Forms" />
        </View>
      </View>
    );
  }
  return (
    <View style={{ paddingTop: 30, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, color: '#282C50', marginTop: 10, fontWeight: 'bold' }}>You do not have access to the forms panel</Text>
    </View>
  );
}



// Queries
export const executeApiQuery = async (url, token, method = 'get', data = {}, params = {}) => {
  const headers = {
    'Content-Type': "application/json",
    'Accept': "*/*",
    Authorization: 'bearer ' + token,
  };

  const config = {
    method,
    url:APP_API+url,
    data,
    headers,
    params,
  };

  try {
    return await axios(config);
    // return response;
  } catch (error) {
    // console.log(error.response.data);
    return error;
  }
};


// export const validateInitValue = (value, valueType) => {
//   if (value !== null) {
//     if (valueType === 'float'){
//       let y =  parseFloat(value);
//       if (!isNaN(y))
//         return y;
//     } 
//     if(valueType === 'int'){
//       let y =  parseInt(value);
//       if (!isNaN(y))
//         return y;
//     }
//   }else{
//     return null;
//   }
//   return value;
// }

const validateInitValue = (value, valueType) => {
  if (value === null || value === undefined) {
    return valueType === "string" ? "" : null;
  }

  if (valueType === "float") {
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) ? parsedValue : null;
  }

  if (valueType === "int") {
    const parsedValue = parseInt(value, 10);
    return !isNaN(parsedValue) ? parsedValue : null;
  }

  if (valueType === "string") {
    return typeof value === "string" ? value : null;
  }

  return value;
};

export const ShowAlert =(title, message, buttonArray = undefined) =>{
  Alert.alert(
    `${title}`,
    `${message}`,
    buttonArray
  );
}

export const getFarmsFromGlobalByName = async (name="") => {

};
