import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useForm, Controller, reset} from 'react-hook-form';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {timeConvert, timeConverter} from '../services/Helpers';

export const Category = ({addToNewForm, props, shouldSave}) => {
  defaultValues = () => {
    let vals = {};
    if (typeof props.fields !== 'undefined') {
      props.fields.map(item => {
        vals[item.label] = '';
      });
    }
    return vals;
  };

  //const [fields, setFields] = useState(defaultValues());

  useEffect(() => {
    reset(defaultValues());
  }, [props]);

  const {
    register,
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue
  } = useForm({
    defaultValues: defaultValues(),
  });

  const onSubmit = data => {
    let newObj = {[props.title]: data};
    addToNewForm(newObj);
    Alert.alert('Notification', `Category successfully added to this FORM`);
  };

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
          {props.title} Form
        </Text>
        {props.fields.map((item, index) => {
            //Nested Fields Conditional Function
            if (typeof item.fields !== 'undefined') {
              //Nested Calculated (Tally Total) Fields Function
              if (item.type !== 'time') {
                const [values, setValues] = useState([
                  { val: 0, date: new Date(), isVisible: false },
                  { val: 0, date: new Date(), isVisible: false },
                  { val: 0, date: new Date(), isVisible: false },
                  { val: 0, date: new Date(), isVisible: false },
                ]);
                const [total,setTotal] =useState(0);
                // SetTotal Local Variable
                useEffect(() => {
                  setTotal(
                    values.reduce((accumulator, currentValue) => accumulator + currentValue.val, 0)
                  );
                }, [values]);
                
                // SetTotal Form Variable
                useEffect(() => {
                  setValue(`${item.label}.${item.label} Total`, total);
                }, [total]);
                // Handles Value group instance change
                const setValue = (name, value) => {
                  if (control.fieldsRef.current[name]) {
                    control.fieldsRef.current[name].value = value;
                  }
                };
                // Handles specific value in value group
                const onInputChange = (value, index) => {
                  const newValues = [...values];
                  newValues[index].val = Number(value);
                  newValues[index].date = new Date();
                  setValues(newValues);
                  setValue(
                    `${item.label}.${item.fields[index].label} Time Captured`,
                    newValues[index].date.toJSON()
                  );
                };
                // Handles specific date value in value group
                const onTimeChange = (index, selectedDate) => {
                  const newValues = [...values];
                  newValues[index].date = selectedDate;
                  setValues(newValues);
                  setValue(
                    `${item.label}.${item.fields[index].label} Time Captured`,
                    selectedDate.toJSON()
                  );
                };
              
                const renderInput = (index) => (
                  <Controller
                    control={control}
                    defaultValue=""
                    name={`${item.label}.${item.fields[index].label}`}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder={`Enter ${index + 1} Entry`}
                        value={value}
                        onBlur={onBlur}
                        keyboardType="number-pad"
                        onChangeText={(value) => onInputChange(value, index)}
                      />
                    )}
                  />
                );
              
                const renderDateTimePicker = (index) => (
                  <Controller
                    control={control}
                    name={`${item.label}.${item.fields[index].label} Time Captured`}
                    value={values[index].date}
                    render={({ field }) => (
                      <TouchableOpacity
                        onPress={() => {
                          const newValues = [...values];
                          newValues[index].isVisible = true;
                          setValues(newValues);
                        }}
                        style={{ padding: 5, backgroundColor: 'beige' }}>
                        <Text style={{ color: 'black' }}>
                          Time: {timeConvert(values[index].date.toLocaleTimeString('en-US', { hour12: true }))}
                        </Text>
                        {values[index].isVisible && (
                          <DateTimePicker
                            value={values[index].date}
                            is24Hour={false}
                            onChange={(event, selectedDate) => {
                              const newValues = [...values];
                      newValues[index].isVisible = false;
                      if (selectedDate) {
                        onTimeChange(index, selectedDate);
                      }
                      setValues(newValues);
                      }}/>
                    )
                    }
                  </TouchableOpacity>
                  )}
                />
                );
              
                const renderFields = () =>
                  item.fields.map((field, index) => (
                    <View style={{}} key={index}>
                    <Text style={styles.label}>{field.label}</Text>
                    {renderInput(index)}
                    {renderDateTimePicker(index)}
                    </View>
                ));
                return (
                    <View style={{}}>
                    <Text style={styles.title}>{item.label}</Text>
                    {renderFields()}
                    <Text style={styles.label}>Total: {total}</Text>
                    <Button title="Save" onPress={handleSubmit(onSubmit)} />
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
                            const [date, setDate] = useState(new Date());
                            const [isVisible, setIsVisible] = useState(false);
                            // useEffect(() => {
                            //   setValue(`${item.label}.${subItem.label} Time Taken`, date.toLocaleTimeString('en-US', { hour12: false }));
                            //   },[date])
                            return(
                              <View key={subIndex}>
                                <Controller
                                  key={subIndex}
                                  control={control}
                                  name={item.label + '.' + subItem.label}
                                  defaultValue=""
                                  render={({field: {onChange, onBlur, value}}) => (
                                    <>
                                      <TextInput
                                        style={styles.input}
                                        placeholder={subItem.label}
                                        onBlur={onBlur}
                                        onChangeText={(e) => {setValue(`${item.label}.${subItem.label} Time Captured`,date.toString()); return onChange(Number(e));}}
                                        value={value}
                                        keyboardType={(subItem.type=='int' || subItem.type=='float'|| subItem.type=='time') ? "number-pad":"default"}
                                        />
                                    </>
                                  )}
                                  />
                                  <Controller
                                    control={control}
                                    name={item.label + '.' +subItem.label+' Time Captured'}
                                    value={date}
                                    defaultValue=""
                                    render={({ field, register }) => (
                                    <TouchableOpacity onPress={()=>setIsVisible(true)} style={{paddingVertical:10, paddingHorizontal:5, backgroundColor:'beige'}}>
                                        <Text style={{color:'black'}}>Time Captured: {timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                                        {
                                          isVisible && 
                                          <DateTimePicker 
                                            value={date} 
                                            is24Hour={false} 
                                            onChange={(event, selectedDate)=>{
                                              setIsVisible(false);
                                              setDate(selectedDate);
                                              setValue(`${item.label}.${subItem.label} Time Captured`,date.toString())
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
                        })}
                    </View>
                  </View>
                )
              }             
            } else {
              //Radio Button Field Function
              if(item.type == 'option'){
                return            (
                  <View style={{marginVertical: 12}} key={index}>
                    <Text style={{color: '#282C50', fontSize: 18}}>
                      {item.label}
                    </Text>
                    <Controller
                      control={control}
                      name={item.label}
                      render={({field: {onChange, value}}) => (
                        <>
                          <RadioButton.Group
                            onValueChange={onChange}
                            value={value}
                            >
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                              <RadioButton value={item.options[0]}></RadioButton>
                              <Text style={{fontSize:16}}>{item.options[0]}</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                              <RadioButton value={item.options[1]}></RadioButton>
                              <Text style={{fontSize:16}}>{item.options[1]}</Text>
                            </View>
                          </RadioButton.Group>
                        </>
                      )}
                    />
                  </View>
                )
              }else if(item.type == 'time'){
                const [date,setDate]=useState(new Date());
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
                    <TouchableOpacity onPress={()=>setIsVisible(true)}  style={{padding:5, backgroundColor:'beige'}}>
                        <Text style={{color:'black'}}>Time: {timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}</Text>
                        {
                          isVisible && 
                          <DateTimePicker 
                            value={date} 
                            is24Hour={false} 
                            onChange={(event, selectedDate)=>{
                              setIsVisible(false);
                              setDate(selectedDate);
                              setValue(`${item.label}`, date.toString())
                              }
                            } 
                            mode="time" display="spinner" 
                          />
                        }
                        {/* {console.log(item.fields[0].label)} */}
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
                    <TouchableOpacity onPress={()=>setIsVisible(true)}  style={{padding:5, backgroundColor:'beige'}}>
                        <Text style={{color:'black'}}>{timeConverter(date)}</Text>
                        {
                          isVisible && 
                          <DateTimePicker 
                            value={date} 
                            is24Hour={true} 
                            onChange={(event, selectedDate)=>{
                              setIsVisible(false);
                              setDate(selectedDate);
                              setValue(`${item.label}`, date.toString())
                              }
                            } 
                            mode="time" display="spinner" 
                          />
                        }
                        {/* {console.log(item.fields[0].label)} */}
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
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={item.type=="description"? styles.description:styles.input}
                      placeholder={item.label}
                      onBlur={onBlur}
                      onChangeText={(e) => {(item.type=='int') ? setValue(`${item.label}`,parseInt(e)):(item.type=='float') ? setValue(`${item.label}`,parseFloat(e)):onChange(e);}}
                      value={value}
                      defaultValue={""}
                      multiline={item.type=="description"? true : false}
                      keyboardType={(item.type=='int' || item.type=='float') ? "number-pad":"default"}
                    />
                  )}
                />
              </View>
              );
              }
            }
        })}
        <View style={{marginTop: 10, marginBottom: 20, alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}>
            <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
});
