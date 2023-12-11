import React,{useState} from 'react';
// import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { convertToCSharpCompatibleFormat, timeConvert, timeConverter } from '../services/Helpers';

export const DualTimeField = ({foundDate, onChange, label, initialDate, setDateFunction}) =>{
    // return(
    //     <View style={{width:'40%'}} key={subIndex}>
    //       <Text style={{fontWeight:'500', fontSize:16}}>{subItem.label.toUpperCase()}:</Text>
    //       <TouchableOpacity disabled={!globalEdit} onPress={()=>setIsVisible(true)} style={{ paddingVertical:20, paddingHorizontal:10, backgroundColor:'beige', fontSize:18}}>
    //         <Text style={{color:'black', fontSize:16, textAlign:'center'}}>{l?" -  Select Time  - ":timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
    //         <Controller
    //           render={({ field:{ onChange }}) =>{ 
    //             useEffect(()=>{
    //               subIndex === 0 ? startTime.current=date : endTime.current=date;
    //               setLightingHours(calculateTimeDifference(startTime.current, endTime.current));
    //               setValue(baseFormLabel + '.' +subItem.label, convertToCSharpCompatibleFormat(date));
    //             },[date]);
    //             return(
    //             <>
    //               {
    //                 isVisible && 
    //                 <DateTimePicker 
    //                   style={{flex:1}}
    //                   value={date} 
    //                   is24Hour={false}
    //                   defaultValue={date}
    //                   onChange={(event, selectedDate)=>{
    //                     // Combine the current date with the selected time
    //                     const currentTime = new Date();
    //                     const combinedDateTime = new Date(
    //                       currentTime.getFullYear(),
    //                       currentTime.getMonth(),
    //                       currentTime.getDate(),
    //                       selectedDate.getHours(),
    //                       selectedDate.getMinutes()
    //                     );
                      
    //                     setIsVisible(false);
    //                     setDate(combinedDateTime)
    //                     // setDate(selectedDate);
    //                     if(l && event.type === 'set'){
    //                       setL(false);
    //                     }
    //                     // onChange(convertToCSharpCompatibleFormat(combinedDateTime));
    //                     }
    //                   } 
    //                   mode="time" display="spinner" 
    //                 />
    //               }
    //             </>
    //           )}}
    //           control={control}
    //           name={baseFormLabel + '.' +subItem.label}
    //           defaultValue={defaultVal[subItem.label] || "" } 
    //           value={convertToCSharpCompatibleFormat(date)}
    //           rules={{ required: true }}
    //         />
    //       </TouchableOpacity>
    //       { 
    //         errors 
    //         && errors[baseFormLabel] && errors[baseFormLabel][subItem.label] 
    //         && (
    //               <Text style={{ color: "red" }}>
    //              {errors[baseFormLabel][subItem.label].type}
    //               ERORR
    //           </Text>
    //         )
    //       }
    //     </View>
    // )
    const [isVisible, setVisability] = useState(false);
    const [date, setDate] = useState(initialDate);
    const [dateNotFound, setDateNotFound] = useState(foundDate);
    
    return(
      <View style={{width:'40%'}}>
          <Text style={{fontWeight:'500', fontSize:16}}>{label}</Text>
          <TouchableOpacity onPress={()=>setVisability(true)} style={{ paddingVertical:20, paddingHorizontal:10, backgroundColor:'beige', fontSize:18}}>
              <Text style={{color:'black', fontSize:16, textAlign:'center'}}>{dateNotFound ? ' - Select Time - ':timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
              {
                  isVisible && 
                  <DateTimePicker 
                    style={{flex:1}}
                    value={date} 
                    is24Hour={false}
                    defaultValue={date}
                    onChange={(event, selectedDate)=>{
                      // Combine the current date with the selected time
                      const currentTime = new Date();
                      const combinedDateTime = new Date(
                        currentTime.getFullYear(),
                        currentTime.getMonth(),
                        currentTime.getDate(),
                        selectedDate.getHours(),
                        selectedDate.getMinutes()
                      );
                      //   
                      setVisability(false);
                      setDateNotFound(false);
                      
                      setDate(combinedDateTime)
                      setDateFunction(combinedDateTime)
                      onChange(convertToCSharpCompatibleFormat(combinedDateTime));
                      }
                    } 
                    mode="time" display="spinner" 
                  />
              }
          </TouchableOpacity>
      </View>
    )
}
export const SingleTimeField = ({foundDate, onChange, label, initialDate, setDateFunction}) =>{
  const [isVisible, setVisability] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [dateNotFound, setDateNotFound] = useState(foundDate);
  
  return(
    <View>
        {/* <Text style={{fontWeight:'500', fontSize:16}}>{label}</Text> */}
        <TouchableOpacity onPress={()=>setVisability(true)} style={{ paddingVertical:20, paddingHorizontal:10, backgroundColor:'beige', fontSize:18}}>
            <Text style={{color:'black', fontSize:16, textAlign:'center'}}>{dateNotFound ? ' - Select Time - ':timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
            {
                isVisible && 
                <DateTimePicker 
                  style={{flex:1}}
                  value={date} 
                  is24Hour={false}
                  defaultValue={date}
                  onChange={(event, selectedDate)=>{
                    if(event.type !== 'set'){
                      setVisability(false);
                      return;
                    }
                    // Combine the current date with the selected time
                    const currentTime = new Date();
                    const combinedDateTime = new Date(
                      currentTime.getFullYear(),
                      currentTime.getMonth(),
                      currentTime.getDate(),
                      selectedDate.getHours(),
                      selectedDate.getMinutes()
                    );
                    //   
                    setVisability(false);
                    setDateNotFound(false);
                    
                    setDate(combinedDateTime)
                    setDateFunction(combinedDateTime)
                    onChange(convertToCSharpCompatibleFormat(combinedDateTime));
                  }} 
                  mode="time" display="spinner" 
                />
            }
        </TouchableOpacity>
    </View>
  )
}
export const StopWatchTimeField = ({foundDate, onChange, label, initialDate, setDateFunction}) =>{
  const [isVisible, setVisability] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [dateNotFound, setDateNotFound] = useState(foundDate);
  
  return(
    <View>
        {/* <Text style={{fontWeight:'500', fontSize:16}}>{label}</Text> */}
        <TouchableOpacity onPress={()=>setVisability(true)} style={{ paddingVertical:20, paddingHorizontal:10, backgroundColor:'beige', fontSize:18}}>
            <Text style={{color:'black', fontSize:16, textAlign:'center'}}>{dateNotFound ? ' - Select Time - ':timeConverter(date)}</Text>
            {
                isVisible && 
                <DateTimePicker 
                  style={{flex:1}}
                  value={date} 
                  is24Hour={true}
                  defaultValue={date}
                  onChange={(event, selectedDate)=>{
                    if(event.type !== 'set'){
                      setVisability(false);
                      return;
                    }
                    // Combine the current date with the selected time
                    const currentTime = new Date();
                    const combinedDateTime = new Date(
                      currentTime.getFullYear(),
                      currentTime.getMonth(),
                      currentTime.getDate(),
                      selectedDate.getHours(),
                      selectedDate.getMinutes()
                    );
                    //   
                    setVisability(false);
                    setDateNotFound(false);
                    
                    setDate(combinedDateTime)
                    setDateFunction(combinedDateTime)
                    onChange(convertToCSharpCompatibleFormat(combinedDateTime));
                    }
                  } 
                  mode="time" display="spinner" 
                />
            }
        </TouchableOpacity>
    </View>
  )
}



function convertToCSharpCompatibleFormat(dateString) {
  // let date = new Date(dateString);
  // let offset = -5; // UTC-5 for Eastern Time
  // let localDate = new Date(date.getTime() + offset * 3600 * 1000);
  let localDate = new Date(dateString);
  
  let year = localDate.getFullYear();
  let month = String(localDate.getMonth() + 1).padStart(2, '0');
  let day = String(localDate.getDate()).padStart(2, '0');
  let hours = String(localDate.getHours()).padStart(2, '0');
  let minutes = String(localDate.getMinutes()).padStart(2, '0');
  let seconds = String(localDate.getSeconds()).padStart(2, '0');
  // console.log('================== To C#Version ====================');
  // console.log(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  // console.log('=====================================================');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// TIme and date formatters
function timeConvert (time) {
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

function timeConverter (dateJSON) {
  const date= new Date(dateJSON)
  let hh = date.getHours();
  let mm = date.getMinutes();

  const strTime = hh + ' Hours : ' + mm +' Minutes';
  return strTime;
}
