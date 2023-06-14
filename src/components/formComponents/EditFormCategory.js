import React, {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useForm, Controller, reset} from 'react-hook-form';
import { RadioButton } from 'react-native-paper';
// import { setNestedObjectValues } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import {timeConvert, timeConverter} from '../../services/Helpers';

export const Category = ({addToNewForm, props, asyncData, save, setSave, saving, setSaving, submitView, newSave, setNewSave}) => {
  const isFirstRender = useRef(true);
  const {
    register,
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
    setValue
  } = useForm({mode: "onChange"});

  const onSubmit = data => {
    let newObj = {[props.title]: data};
    addToNewForm(newObj);
  };

  useEffect(() => {   
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // 👈️ return early if first render
    }
    if(newSave){
      console.log(getValues());
    }
    setNewSave(false);
  },[newSave]);

  useEffect(() => {   
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // 👈️ return early if first render
    }
    if(save){
      handleSubmit(onSubmit)();
    }
    setSave(false);
  },[save]);

  return (
    <ScrollView>
       <View style={styles.container}>
        <Text
          style={{
            color: '#282C50',
            fontSize: 26,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 20,
            paddingTop: 30,
          }}>
          {props.title} 
        </Text>
        {props.fields.map((item, index) => {

          let defaultVal="";
          Object.keys(asyncData).map((field, fieldIndex) => {
            if(item.label==field && asyncData[field] != ""){
              defaultVal=asyncData[field];
              // console.log(defaultVal);
            }
          });

            //Nested Fields Conditional Function
            if (typeof item.fields !== 'undefined') {
              //Nested Calculated (Tally Total) Fields Function
              // console.log(item.label +": "+item.type);
              if (item.type == 'multi-field') {
                  const [val1,setVal1] =useState(typeof defaultVal[item.fields[0].label] == "undefined" ? 0 : defaultVal[item.fields[0].label]);
                  const [date1, setDate1]= useState(typeof defaultVal[`${item.fields[0].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[0].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[0].label} Time Captured`]));
                  const [isVisible1, setIsVisible1]= useState(false);

                  const [val2,setVal2] =useState(typeof defaultVal[item.fields[1].label] == "undefined" ? 0 : defaultVal[item.fields[1].label]);
                  const [date2, setDate2]= useState(typeof defaultVal[`${item.fields[1].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[1].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[1].label} Time Captured`]));
                  const [isVisible2, setIsVisible2]= useState(false);

                  const [val3,setVal3] =useState(typeof defaultVal[item.fields[2].label] == "undefined" ? 0 : defaultVal[item.fields[2].label]);
                  const [date3, setDate3]=useState(typeof defaultVal[`${item.fields[2].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[2].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[2].label} Time Captured`]));
                  const [isVisible3, setIsVisible3]= useState(false);

                  const [val4,setVal4] =useState(typeof defaultVal[item.fields[3].label] == "undefined" ? 0 : defaultVal[item.fields[3].label]);
                  const [date4, setDate4]= useState(typeof defaultVal[`${item.fields[3].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[3].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[3].label} Time Captured`]));
                  const [isVisible4, setIsVisible4]= useState(false);

                  // console.log(defaultVal[item.fields[3].label])

                  const [total,setTotal] =useState(val1+val2+val3+val4);
                
                  useEffect(()=>{setTotal(Number(val1)+Number(val2)+Number(val3)+Number(val4));})
                  useEffect(()=>{setValue(item.label+"."+item.label+" Total",total);},[total])

                  return (
                    <View style={{marginVertical: 12}} key={index}>
                      <Text style={{color: '#282C50', fontSize: 18}}>
                        {item.label}
                      </Text>
                      <View
                        style={{
                          height:100,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          {/* Entry 1 */}
                          <View>  
                          {/* ERROR BORDER COLOR  */}
                          {/* <View style={{flexDirection:'column', height:'100%', alignContent:'flex-start', alignSelf:'flex-start'}}>  */}
                            <Controller        
                               control={control}   
                               defaultValue={defaultVal[item.fields[0].label]}  
                               name={item.label+"."+item.fields[0].label} 
                               rules={(()=>rules(item.fields[0].type))()}        
                               render={({field: {onChange, value1, onBlur}}) => (            
                                 <TextInput                    
                                   style={styles.input}
                                   placeholder="Enter 1st Entry"            
                                   value={value1} 
                                   defaultValue={defaultVal[item.fields[0].label]? ""+defaultVal[item.fields[0].label]:""}          
                                   onBlur={onBlur}          
                                   keyboardType="number-pad"  
                                   onChangeText={value => {
                                    onChange(value); 
                                    setValue(`${item.label}.${item.fields[0].label} Time Captured`, date1.toJSON()); 
                                    setValue(`${item.label}.${item.fields[0].label}`, Number(value));
                                    setVal1(Number(value));
                                  }}          
                                 />        
                               )} 
                            />
                            { 
                            // console.log(`${item.label}.${item.fields[0].label} : ${value1}`)
                            }
                            {
                              (()=>{
                                let err, r;
                                err = errors[`${item.label}`]
                                err? r = Object.keys(err)[0]:"";
                                // err? console.log(err[r]):"";
                                err? console.log(errors[item.label][item.fields[0].label]):"";
                              })()
                            }
                            {/* {console.log(errors[`${item.label}`])} */}
                            {/* {console.log(item.fields[0].label+"   : " + date1)} */}


                            <Controller
                                control={control}
                                name={item.label + "." + item.fields[0].label + " Time Captured"}
                                defaultValue={date1}
                                value={date1}
                                render={({ field }) => (
                                <TouchableOpacity onPress={()=>setIsVisible1(true)}  style={{padding:5, backgroundColor:'beige'}}>
                                    <Text style={{color:'black'}}>Time: {timeConvert(date1.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                                    {
                                      isVisible1 && 
                                      <DateTimePicker 
                                        value={date1} 
                                        defaultValue={date1} 
                                        is24Hour={false} 
                                        onChange={(event, selectedDate)=>{
                                          setIsVisible1(false);
                                          setDate1(selectedDate);
                                          setValue(`${item.label}.${item.fields[0].label} Time Captured`, date1.toJSON())
                                          }
                                        } 
                                        mode="time" display="spinner" 
                                      />
                                    }
                                </TouchableOpacity>
                                )}
                            />  
                            { 
                              errors && errors[item.label] && errors[item.label][item.fields[0].label] && (
                                errors[item.label][item.fields[0].label].type != 'required' && 
                                (<Text style={{ color: "red" }}>
                                  {errors[item.label][item.fields[0].label].type} ERORR
                                </Text>)
                              )
                            }
                          </View>
                          {/* Entry 2 */}
                          <View>
                            <Controller        
                               control={control}  
                               defaultValue={defaultVal[item.fields[1].label]}        
                               name={item.label+"."+item.fields[1].label}  
                               rules={(()=>rules(item.fields[1].type))()}      
                               render={({field: {onChange, value2, onBlur}}) => (            
                                 <TextInput                    
                                   style={styles.input}
                                   placeholder="Enter 2nd Entry" 
                                   defaultValue={defaultVal[item.fields[1].label]? ""+defaultVal[item.fields[1].label]:""}             
                                   value={value2}            
                                   onBlur={onBlur}        
                                   keyboardType="number-pad"    
                                   onChangeText={value => {
                                    onChange(value);
                                    setValue(`${item.label}.${item.fields[1].label} Time Captured`, date2.toJSON());
                                    setValue(`${item.label}.${item.fields[1].label}`, Number(value));
                                    setVal2(Number(value));
                                  }}          
                                 />        
                               )} 
                            />
                            <Controller
                              control={control}
                              name={item.label+"."+item.fields[1].label+ " Time Captured"}
                              value={date2}
                              defaultValue={date2} 
                              render={({ field }) => (
                              <TouchableOpacity onPress={()=>setIsVisible2(true)}  style={{padding:5, backgroundColor:'beige'}}>
                                  <Text style={{color:'black'}}>Time: {timeConvert(date2.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                                  {
                                    isVisible2 && 
                                    <DateTimePicker 
                                      value={date2} 
                                      defaultValue={date2} 
                                      is24Hour={false} 
                                      onChange={(event, selectedDate)=>{
                                        setIsVisible2(false);
                                        setDate2(selectedDate);
                                        setValue(`${item.label}.${item.fields[1].label} Time Captured`, date2.toJSON())
                                        }
                                      } 
                                      mode="time" display="spinner" 
                                    />
                                  }
                              </TouchableOpacity>
                                )}
                            />
                            {
                              (()=>{
                                let err, r;
                                err = errors[`${item.label}`]
                                err? r = Object.keys(err)[0]:"";
                                // err? console.log(err[r]):"";
                                err? console.log(errors[item.label][item.fields[1].label]):"";

                              })()
                            }
                            { 
                              errors && errors[item.label] && errors[item.label][item.fields[1].label] && (
                                errors[item.label][item.fields[1].label].type != 'required' && ( <Text style={{ color: "red" }}>
                                  {errors[item.label][item.fields[1].label].type} ERORR
                                </Text>)
                              )
                            }
                          </View>
                          {/* Entry 3 */}
                          <View>
                            <Controller        
                               control={control}  
                               defaultValue={defaultVal[item.fields[2].label]}         
                               name={item.label+"."+item.fields[2].label}   
                               rules={(()=>rules(item.fields[2].type))()}     
                               render={({field: {onChange, value3, onBlur}}) => (            
                                 <TextInput 
                                   style={styles.input}                   
                                   placeholder="Enter 3rd Entry" 
                                   defaultValue={defaultVal[item.fields[2].label]? ""+defaultVal[item.fields[2].label]:""}             
                                   value={value3}            
                                   onBlur={onBlur}  
                                   keyboardType="number-pad"          
                                   onChangeText={value => {
                                    onChange(value);
                                    setValue(`${item.label}.${item.fields[2].label} Time Captured`, date3.toJSON());
                                    setValue(`${item.label}.${item.fields[2].label}`, Number(value));
                                    setVal3(Number(value));
                                  }}          
                                 />        
                               )} 
                            />
                            <Controller
                              control={control}
                              name={item.label+"."+item.fields[2].label + " Time Captured"}
                              defaultValue={date3}
                              value={date3}
                              render={({ field }) => (
                              <TouchableOpacity onPress={()=>setIsVisible3(true)}  style={{padding:5, backgroundColor:'beige'}}>
                                  <Text style={{color:'black'}}>Time: {timeConvert(date3.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                                  {
                                    isVisible3 && 
                                    <DateTimePicker 
                                      value={date3} 
                                      defaultValue={date3} 
                                      is24Hour={false} 
                                      onChange={(event, selectedDate)=>{
                                        setIsVisible3(false);
                                        setDate3(selectedDate);
                                        setValue(`${item.label}.${item.fields[2].label} Time Captured`, date3.toJSON())
                                        }
                                      } 
                                      mode="time" display="spinner" 
                                    />
                                  }
                              </TouchableOpacity>
                                )}
                            />
                            {
                              (()=>{
                                let err, r;
                                err = errors[`${item.label}`]
                                err? r= Object.keys(err)[0]:"";
                                // err? console.log(err[r]):"";
                                err? console.log(errors[item.label][item.fields[2].label]):"";

                              })()
                            }
                            { 
                              errors && errors[item.label] && errors[item.label][item.fields[2].label] && (
                                errors[item.label][item.fields[2].label].type != 'required' && (<Text style={{ color: "red" }}>
                                  {errors[item.label][item.fields[2].label].type} ERORR
                                </Text>)
                              )
                            }
                          </View>
                          {/* Entry 4 */}
                          <View>
                            <Controller        
                               control={control} 
                               defaultValue={defaultVal[item.fields[3].label]}           
                               name={item.label+"."+item.fields[3].label}
                               rules={(()=>rules(item.fields[3].type))()}        
                               render={({field: {onChange, value4, onBlur}}) => (            
                                 <TextInput      
                                   style={styles.input}              
                                   placeholder="Enter 4th Entry" 
                                   defaultValue={defaultVal[item.fields[3].label]? ""+defaultVal[item.fields[3].label]:""}             
                                   value={value4}            
                                   onBlur={onBlur} 
                                   keyboardType="number-pad"           
                                   onChangeText={value => {
                                    onChange(value);
                                    setValue(`${item.label}.${item.fields[3].label} Time Captured`, date4.toJSON()); 
                                    setValue(`${item.label}.${item.fields[3].label}`, Number(value)); 
                                    setVal4(Number(value));
                                  }}          
                            />   
                               )} 
                            />
                            <Controller
                              control={control}
                              name={item.label+"."+item.fields[3].label+" Time Captured"}
                              defaultValue={date4} 
                              value={date4}
                              render={({ field }) => (
                              <TouchableOpacity onPress={()=>setIsVisible4(true)}  style={{padding:5, backgroundColor:'beige'}}>
                                  <Text style={{color:'black'}}>Time: {timeConvert(date4.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                                  {
                                    isVisible4 && 
                                    <DateTimePicker 
                                      value={date4} 
                                      defaultValue={date4} 
                                      is24Hour={false} 
                                      onChange={(event, selectedDate)=>{
                                        setIsVisible4(false);
                                        setDate4(selectedDate);
                                        setValue(`${item.label}.${item.fields[3].label} Time Captured`, date4.toJSON())
                                        }
                                      } 
                                      mode="time" display="spinner" 
                                    />
                                  }
                              </TouchableOpacity>
                                )}
                            />
                            {
                              (()=>{
                                let err, r;
                                err = errors[`${item.label}`]
                                err? r= Object.keys(err)[0]:"";
                                err? console.log(err[r]):"";
                                err? console.log(errors[item.label][item.fields[3].label]):"";

                              })()
                            }
                            { 
                              errors && errors[item.label] && errors[item.label][item.fields[3].label] && (
                                errors[item.label][item.fields[3].label].type != 'required' && (<Text style={{ color: "red" }}>
                                  {errors[item.label][item.fields[3].label].type} ERORR
                                </Text>)
                              )
                            }
                          </View>

                          <Text style={{fontSize:18}}>= {total}</Text>
                      </View>
                  </View>
                );
              }else{
                //Nested Time Fields Function
                return(
                  <View style={{marginVertical: 12}} key={index}>
                    <Text style={{color: '#282C50', fontSize: 18}}>
                      {item.label}
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
                              <View key={subIndex}>
                                <Controller
                                  key={subIndex}
                                  control={control}
                                  defaultValue={defaultVal[subItem.label]}
                                  name={item.label + '.' + subItem.label}
                                  rules={(()=>rules(subItem.type))()}
                                  render={({field: {onChange, onBlur, value}}) => (
                                    <>
                                      <TextInput
                                        style={styles.input}
                                        placeholder={subItem.label}
                                        onBlur={onBlur}
                                        onChangeText={(e) => {onChange(e); setValue(`${item.label}.${subItem.label} Time Captured`, (new Date).toJSON()); setValue(`${item.label}.${subItem.label}`, parseFloat(e));}}
                                        defaultValue={defaultVal[subItem.label]? ""+defaultVal[subItem.label]:""}
                                        value={value}
                                        keyboardType={(subItem.type=='int' || subItem.type=='float') ? "number-pad":"default"}
                                        />
                                    </>
                                  )}
                                  />
                                  {/* {console.log(subItem.label + ' time: ' + defaultVal[subItem.label+` Time Captured`])}
                                  {console.log(subItem.type)} */}
                                  <Controller
                                    control={control}
                                    name={item.label + '.' +subItem.label+' Time Captured'}
                                    value={date}
                                    defaultValue={date}
                                    render={({ field, register }) => (
                                    <TouchableOpacity onPress={()=>setIsVisible(true)} style={{paddingVertical:10, paddingHorizontal:5, backgroundColor:'beige'}}>
                                        <Text style={{color:'black'}}>Time: {timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                                        {
                                          isVisible && 
                                          <DateTimePicker 
                                            value={date} 
                                            is24Hour={false}
                                            defaultValue={defaultVal[subItem.label+" Time Captured"]}
                                            onChange={(event, selectedDate)=>{
                                              setIsVisible(false);
                                              setDate(selectedDate);
                                              setValue(`${item.label}.${subItem.label} Time Captured`, date.toJSON())
                                              }
                                            } 
                                            mode="time" display="spinner" 
                                          />
                                        }
                                    </TouchableOpacity>
                                      )}
                                  />
                                  { 
                                    errors && errors[item.label] && errors[item.label][subItem.label] && (
                                      (errors[item.label][subItem.label].type != 'required') && <Text style={{ color: "red" }}>
                                        {errors[item.label][subItem.label].type} ERORR
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
                return(
                  <View style={{marginVertical: 12}} key={index}>
                    <Text style={{color: '#282C50', fontSize: 18}}>
                      {item.label}
                    </Text>
                    <Controller
                      control={control}
                      name={item.label}
                      defaultValue={defaultVal}
                      render={({field: {onChange, value}}) => (
                        <>
                          <RadioButton.Group
                            onValueChange={onChange}
                            value={value}
                            >
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                              <RadioButton status={defaultVal == item.options[0]? "checked" : "unchecked"} value={item.options[0]}></RadioButton>
                              <Text style={{fontSize:16}}>{item.options[0]}</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                              <RadioButton status={defaultVal == item.options[1]? "checked" : "unchecked"} value={item.options[1]}></RadioButton>
                              <Text style={{fontSize:16}}>{item.options[1]}</Text>
                            </View>
                          </RadioButton.Group>
                        </>
                      )}
                    />
                  </View>
                )
              }else if(item.type == 'time'){
                const [date,setDate]=useState((defaultVal === "" ? new Date() : new Date(defaultVal)));
                const [isVisible,setIsVisible]=useState(false);
                return(
                  <View style={{marginVertical: 12}} key={index}>
                    <Text style={{color: '#282C50', fontSize: 18}}>
                      {item.label}
                    </Text>
                  <Controller
                    control={control}
                    name={item.label}
                    value={date}
                    render={({ field }) => (
                    <TouchableOpacity onPress={()=>setIsVisible(true)}  style={{padding:10, backgroundColor:'beige'}}>
                        <Text style={{color:'black'}}>Time: {timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                        {
                          isVisible && 
                          <DateTimePicker 
                            value={date} 
                            defaultValue={date} 
                            is24Hour={false} 
                            onChange={(event, selectedDate)=>{
                              setIsVisible(false);
                              setDate(selectedDate);
                              setValue(`${item.label}`, date.toJSON())
                              }
                            } 
                            mode="time" display="spinner" 
                          />
                        }
                    </TouchableOpacity>
                    )}
              /> 
              </View>
              );
              }else if(item.type == 'justTime'){
                var d=new Date();
                d.setHours(0,0,0,0);
                const [date,setDate]=useState(d);
                const [isVisible,setIsVisible]=useState(false);
                return(
                  <View style={{marginVertical: 12}} key={index}>
                    <Text style={{color: '#282C50', fontSize: 18}}>
                      {item.label}
                    </Text>
                  <Controller
                    control={control}
                    name={item.label}
                    value={date}
                    render={({ field }) => (
                    <TouchableOpacity onPress={()=>setIsVisible(true)}  style={{padding:10, backgroundColor:'beige'}}>
                        <Text style={{color:'black'}}>{timeConverter(date)}</Text>
                        {
                          isVisible && 
                          <DateTimePicker 
                            value={date} 
                            defaultValue={date} 
                            is24Hour={true} 
                            onChange={(event, selectedDate)=>{
                              setIsVisible(false);
                              setDate(selectedDate);
                              setValue(`${item.label}`, date.toJSON())
                              }
                            } 
                            mode="time" display="spinner" 
                          />
                        }
                    </TouchableOpacity>
                    )}
              /> 
              </View>
              );
              }else{ 
              //Typical Input Field Function       
                return(
                <View style={{marginVertical: 12}} key={index}>
                  <Text style={{color: '#282C50', fontSize: 18}}>
                    {item.label}
                  </Text>
                  <Controller
                    control={control}
                    name={item.label}
                    defaultValue={defaultVal}
                    rules={(()=>rules(item.type))()}
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextInput
                        style={item.type=="description"? styles.description:styles.input}
                        placeholder={item.label}
                        onBlur={onBlur}
                        onChangeText={(e) => {
                          (item.type=='float' || item.type=='int') ? (()=>{
                            console.log(parseFloat(e));
                            onChange(e)
                            setValue(`${item.label}`,
                            parseFloat(e));
                          })()
                          // :(item.type=='int') ? (()=>{
                          //   console.log(parseInt(e));
                          //   onChange(e)
                          //   setValue(`${item.label}`,
                          //   parseInt(e));
                          // })()
                          :(()=>{
                            console.log("else252:   " + e);
                            onChange(e)
                          })()
                        //   (item.type=='int') ? (()=>{console.log(parseInt(e));setValue(`${item.label}`,parseInt(e));onChange(e)})():
                        //   (item.type=='float') ? (()=>{!isNaN(parseFloat(e))? 
                        //     (()=>{console.log(e); onChange(e)})():
                        //     (()=>{setValue(`${item.label}`,parseFloat(e)); onChange(parseFloat(e))})()
                        //   })():
                        //   (()=>{setValue(`${item.label}`,e); onChange(e)})()
                      }}
                        value={value}
                        defaultValue={""+defaultVal}
                        multiline={item.type=="description"? true : false}
                        keyboardType={(item.type=='int' || item.type=='float') ? "number-pad":"default"}
                      />
                    )}
                  />
                  {
                    errors && errors[item.label] && (
                      (errors[item.label].type != 'required') && (<Text style={{ color: "red" }}>
                        {errorMessage(errors[item.label].type)}
                      </Text>)
                    )
                  }
                </View>
                );
              }
            }
        })}
        {submitView(props.title, isValid)}
      </View>
    </ScrollView>
  );
};

const validateField = (val) => {
  (item.type=='float'||item.type=='int') ? (()=>{
    // console.log(parseFloat(val));
    setValue(`${item.label}`,
    parseFloat(e));
    onChange(e)
  })()
  :(()=>{
    // console.log("else252:   " + e);
    onChange(e)
  })()
}

const rules = (type) => {
  if(type === 'int'){
    // console.log('int');
    return({
      pattern:/^[0-9]*$|^NULL$/,
      // required: true,
      min:1,
      max:1200,
    });
  }
  else if(type === 'float'){
    // console.log('float');
    return({
      pattern: /^[+-]?([0-9]*[.])?[0-9]+$/,
      // required: true,
      min:1,
      max:1200,
    });
  }
  // else if(type === 'description'){
  //   // console.log('description');
  //   return ({
  //     // required: true
  //   })
  // }
  else{
    // console.log('string');
    return ({
      // required: true
    })
  }
}
const errorMessage = (type) => {
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
  button: {
    backgroundColor: '#282C50',
    alignItems: 'center',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    width: 200,
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
});
