import React, {useState, useRef, useMemo, useContext, useEffect} from 'react';
import {
  Alert,
  // Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FORM_STATUS_OBJ} from '../Constants';
import {Controller} from 'react-hook-form';
import {
  convertToCSharpCompatibleFormat,
  convertToJSCompatibleFormat,
  WhitePlus,
  timeConvert,
} from './Helpers';
import {DualTimeField, SingleTimeField, StopWatchTimeField} from '../formFields/LightsOnOff_Time';
import {RadioButton} from 'react-native-paper';

//Gets Forms all forms from async storage and returns an array of forms
export const getAllFormsFromAsync = async () => {
  try {
    const stringValue = await AsyncStorage.getItem('@forms');
    return stringValue ? JSON.parse(stringValue) : null;
  } catch (error) {
    Alert.alert('Error!', 'Unable to load forms, please try again.');
    return null;
  }
};

//DELETES form from device and returns the list of remaining forms as an array
export const deleteFormByFormId = async formId => {
  try {
    const storedForms = await AsyncStorage.getItem('@forms');

    if (!storedForms) {
      Alert.alert('Error', 'No forms available to delete.');
      return null;
    }

    const storedFormsParsed = JSON.parse(storedForms);
    const updatedForms = storedFormsParsed.filter(form => form['Form Id'] !== formId);

    if (updatedForms.length === storedFormsParsed.length) {
      Alert.alert('Error', 'Form not found.');
      return null;
    }

    // Update the forms in AsyncStorage
    await AsyncStorage.setItem('@forms', JSON.stringify(updatedForms));

    return updatedForms;
  } catch (e) {
    Alert.alert('Error', 'An error occurred while deleting the form.');
    console.error('Error deleting form:', e);
    return null;
  }
};

export const getAllFormIds = async () => {
  try {
    const forms = await getAllFormsFromAsync();

    if (!forms) return [];

    // Use map to extract form IDs in a more concise way
    const formIds = forms.map(form => form['Form Id']);

    return formIds;
  } catch (error) {
    console.error('Error fetching form IDs:', error);
    return [];
  }
};

export const doesFormExist = async formId => {
  try {
    const formIds = await getAllFormIds();

    if (!formIds || formIds.length === 0) {
      return false;
    }

    return formIds.includes(formId);
  } catch (error) {
    console.error('Error checking if form exists:', error);
    return false;
  }
};

export const saveForm = async form => {
  let found = false;
  let updatedForm = {};
  const arrForm = [form];

  try {
    // Retrieve the stored forms from AsyncStorage
    const storedForms = await AsyncStorage.getItem('@forms');
    const storedFormsParsed = storedForms ? JSON.parse(storedForms) : [];

    // Find if the form already exists
    const updatedForms = storedFormsParsed.map(storedForm => {
      if (storedForm['Form Id'] === form['Form Id']) {
        found = true;
        updatedForm = {...storedForm, ...form}; // Merge the existing form with the updated data
        return updatedForm;
      }
      return storedForm;
    });

    if (found) {
      // If the form was found, save the updated form list to AsyncStorage
      await AsyncStorage.setItem('@forms', JSON.stringify(updatedForms));
      return updatedForm;
    } else {
      // If the form was not found, add the new form and save
      const newForms = [...storedFormsParsed, ...arrForm];
      await AsyncStorage.setItem('@forms', JSON.stringify(newForms));
      return arrForm[0]; // Return the newly added form
    }
  } catch (error) {
    Alert.alert('Error', 'An error occurred while saving the form.');
    return null;
  }
};

export const setFormStatus = ({type, name}) => {
  if (type?.toLowerCase() === 'grow')
    if (name?.toLowerCase().includes('grow 11')) return FORM_STATUS_OBJ[0];
    else return FORM_STATUS_OBJ[1];
  else return FORM_STATUS_OBJ[0];
};

export const CategoryController = ({categorySchema, retrievedData, form, farm}) => {
  const shouldDisplay = () => {
    return (
      categorySchema.type.toLowerCase() === farm.type.toLowerCase() ||
      categorySchema.type.toLowerCase() === 'common'
    );
  };
  const [collapsed, setCollapsed] = useState(() => shouldDisplay());
  const DISABLED = !shouldDisplay();
  const data = useRef({retrievedData});

  return (
    <View>
      {
        <TouchableOpacity
          disabled={DISABLED}
          onPress={() => {
            data.current = {retrievedData: form.getValues(categorySchema.title)};
            setCollapsed(!collapsed);
          }}>
          <View
            style={
              collapsed
                ? {
                    justifyContent: 'center',
                    paddingVertical: 20,
                    paddingTop: 30,
                  }
                : {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: '#282C50',
                    paddingVertical: 20,
                    paddingTop: 30,
                    paddingHorizontal: '5%',
                  }
            }>
            <Text
              style={
                collapsed
                  ? {
                      color: '#282C50',
                      fontSize: 26,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }
                  : {
                      color: 'white',
                      fontSize: 26,
                      fontWeight: 'bold',
                      textAlign: 'left',
                    }
              }>
              {categorySchema.title.toUpperCase()}
            </Text>
            {!collapsed && <WhitePlus size={32} />}
          </View>
        </TouchableOpacity>
      }
      {collapsed && (
        <Category
          categorySchema={categorySchema}
          retrievedData={data.current.retrievedData}
          form={form}
          farm={farm}
        />
      )}
    </View>
  );
};

export const Category = ({categorySchema, retrievedData, form, allowEdit, farm}) => {
  // ToDo: Time fields need to be fixed- currently not saving state change or rerender
  const {
    control,
    formState: {errors, isValid},
    setValue,
  } = form;

  if (!retrievedData) {
    retrievedData = {};
  }

  const globalEdit = typeof allowEdit == 'undefined' ? true : allowEdit;
  const dateGlobal = new Date();

  return (
    <ScrollView>
      <View style={styles.container}>
        {categorySchema.fields.map((item, index) => {
          if (farm?.type.toLowerCase() != 'production') {
            if (item.label.includes('Female')) if (farm.house.includes('B')) return;
            if (item.label.includes('Male')) if (!farm.house.includes('B')) return;
          }

          // Checking the retrieved data for a value matching this object key
          let defaultVal = '';
          let baseFormLabel = categorySchema.title + '.' + item.label;
          // console.log(baseFormLabel);
          Object.keys(retrievedData).map((field, fieldIndex) => {
            if (item.label === field && retrievedData[field] !== '') {
              defaultVal = retrievedData[field];
            }
          });

          //Nested Fields Conditional Function
          if (typeof item.fields !== 'undefined') {
            // Check for fields array
            if (item.type === 'multi-field') {
              let total = 0;
              const fieldFunc = item.fields.map((subItem, subIndex) => {
                const initVal = validateInitValue(
                  defaultVal[`${item.fields[subIndex].label}`],
                  subItem.type,
                );
                const [valueState, setValueState] = useState(initVal);
                const [date, setDate] = useState(
                  setInitDateTime(defaultVal[`${item.fields[subIndex].label} Time Captured`]),
                );
                const [isVisible, setIsVisible] = useState(false);
                const [validDefaultDate, setValidDate] = useState(
                  validateInitDateTime(defaultVal[`${item.fields[subIndex].label} Time Captured`]),
                );

                // Add the initial value to the total
                total += Number(valueState);

                return (
                  <View style={{width: '24%'}} key={subIndex}>
                    <View>
                      <Controller
                        key={subIndex}
                        control={control}
                        defaultValue={initVal}
                        name={baseFormLabel + '.' + subItem.label}
                        rules={(() =>
                          rules(item.fields[subIndex].type, item.fields[subIndex].regex))()}
                        render={({field: {onChange, onBlur, value}}) => {
                          useEffect(() => {
                            const updatedTotal = Number(total) - Number(valueState) + Number(value);
                            total = updatedTotal;
                            setValue(baseFormLabel + '.' + item.label + ' Total', updatedTotal);

                            if (value === 0) {
                              setValueState('0');
                              setValidDate(true);
                            } else if (value) {
                              setValueState(value + '');
                              setValidDate(true);
                            } else {
                              setValueState('');
                              setValidDate(false);
                            }
                          }, [value]);

                          return (
                            <>
                              <TextInput
                                editable={globalEdit}
                                style={styles.input}
                                placeholder={subItem.label}
                                onBlur={onBlur}
                                onChangeText={value => {
                                  const newDate = new Date();
                                  // const convertedDate = fourFieldTime(subIndex).toISOString();
                                  const convertedDate = convertToCSharpCompatibleFormat(
                                    fourFieldTime(subIndex),
                                  );
                                  onChange(value);
                                  if (value === '') {
                                    setValue(`${baseFormLabel}.${subItem.label}`, null);
                                    setValue(
                                      `${baseFormLabel}.${subItem.label} Time Captured`,
                                      null,
                                    );
                                  } else {
                                    setValue(`${baseFormLabel}.${subItem.label}`, Number(value));
                                    setValue(
                                      `${baseFormLabel}.${subItem.label} Time Captured`,
                                      convertedDate,
                                    );
                                  }
                                  setDate(newDate);
                                }}
                                value={valueState}
                                keyboardType={
                                  subItem.type === 'int' || subItem.type === 'float'
                                    ? 'number-pad'
                                    : 'default'
                                }
                              />
                            </>
                          );
                        }}
                      />
                      <Controller
                        control={control}
                        name={baseFormLabel + '.' + subItem.label + ' Time Captured'}
                        value={null}
                        defaultValue={
                          defaultVal[`${item.fields[subIndex].label} Time Captured`] || null
                        }
                        render={() => (
                          <View
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 5,
                              backgroundColor: 'beige',
                            }}>
                            <Text style={{color: 'black', textAlign: 'center'}}>
                              {timeConvert(
                                fourFieldTime(subIndex).toLocaleTimeString('en-US', {hour12: true}),
                              )}
                            </Text>
                          </View>
                        )}
                      />
                    </View>

                    {errors &&
                      errors[categorySchema.title] &&
                      errors[categorySchema.title] &&
                      errors[categorySchema.title][item.label] &&
                      errors[categorySchema.title][item.label][subItem.label] &&
                      errors[categorySchema.title][item.label][subItem.label].type !=
                        'required' && (
                        <Text style={{color: 'red'}}>
                          {errors[categorySchema.title][item.label][subItem.label].type} ERORR
                        </Text>
                      )}
                  </View>
                );
              });

              useEffect(() => {
                setValue(baseFormLabel + '.' + item.label + ' Total', total);
              }, [total]);

              // console.log(fieldFunc[0].props.children[0].props);
              return (
                <View style={{marginVertical: 12}} key={index}>
                  <Text style={{color: '#282C50', fontSize: 18}}>
                    {item.label}
                    <Text style={{color: 'red'}}>
                      {item.fields[0].regex.isRequired ? ' *' : ''}
                    </Text>
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    {fieldFunc}
                  </View>
                  <Text>
                    Total {item.label}: {total}
                  </Text>
                </View>
              );
            } else if (item.type == 'multi-time-only') {
              let startTime = useRef(
                defaultVal[`${item.fields[0].label}`]
                  ? setInitDateTime(defaultVal[`${item.fields[0].label}`])
                  : '',
              );
              let endTime = useRef(
                defaultVal[`${item.fields[1].label}`]
                  ? setInitDateTime(defaultVal[`${item.fields[1].label}`])
                  : '',
              );
              const [lightingHours, setLightingHours] = useState(
                calculateTimeDifference(startTime.current, endTime.current),
              );

              return (
                <View style={{marginVertical: 12}} key={index}>
                  <Text style={{color: '#282C50', fontSize: 18}}>
                    {item.label}
                    {item.fields[0].regex.isRequired && <Text style={{color: 'red'}}> *</Text>}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    {item.fields.map((subItem, subIndex) => {
                      const l =
                        defaultVal[`${item.fields[subIndex].label}`] === null ||
                        item.fields[subIndex].label === '' ||
                        isNaN(new Date(defaultVal[`${item.fields[subIndex].label}`]))
                          ? true
                          : false;
                      const [date, setDate] = useState(
                        setInitDateTime(defaultVal[`${item.fields[subIndex].label}`]),
                      );
                      useEffect(() => {
                        subIndex === 0 ? (startTime.current = date) : (endTime.current = date);
                        setLightingHours(
                          calculateTimeDifference(startTime.current, endTime.current),
                        );
                      }, [date]);
                      return (
                        <Controller
                          key={subIndex}
                          control={control}
                          name={baseFormLabel + '.' + subItem.label}
                          render={({field: {onChange}}) => (
                            <DualTimeField
                              foundDate={l}
                              onChange={onChange}
                              form={form}
                              label={item.fields[subIndex].label}
                              initialDate={date}
                              setDateFunction={setDate}
                            />
                          )}
                          defaultValue={defaultVal[subItem.label] || null}
                          value={convertToCSharpCompatibleFormat(date)}
                          rules={{required: true}}
                        />
                      );
                    })}
                  </View>
                  <Text>Lighting hours: {lightingHours}</Text>
                </View>
              );
            } else {
              //Nested Time Fields Function
              return (
                <View style={{marginVertical: 12}} key={index}>
                  <Text style={{color: '#282C50', fontSize: 18}}>
                    {item.label}
                    <Text style={{color: 'red'}}>
                      {item.fields[0].regex.isRequired ? ' *' : ''}
                    </Text>
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    {item.fields.map((subItem, subIndex) => {
                      return (
                        <View style={{width: '40%'}} key={subIndex}>
                          <Controller
                            key={subIndex}
                            control={control}
                            defaultValue={validateInitValue(
                              defaultVal[subItem.label],
                              subItem.type,
                            )}
                            name={baseFormLabel + '.' + subItem.label}
                            rules={(() => rules(subItem.type, subItem.regex))()}
                            render={({field: {onChange, onBlur, value}}) => (
                              <>
                                <TextInput
                                  editable={globalEdit}
                                  style={styles.input}
                                  placeholder={subItem.label}
                                  defaultValue={
                                    parseFloat(defaultVal[subItem.label]) >= 0
                                      ? '' + defaultVal[subItem.label]
                                      : ''
                                  }
                                  // defaultValue={defaultVal[subItem.label]? ""+defaultVal[subItem.label]:""}
                                  onBlur={onBlur}
                                  onChangeText={e => {
                                    const convertedDate = convertToCSharpCompatibleFormat(
                                      doubleFieldTime(subIndex),
                                    );
                                    console.log(convertedDate);
                                    onChange(e);
                                    if (e !== '') {
                                      setValue(
                                        `${baseFormLabel}.${subItem.label} Time Captured`,
                                        convertedDate,
                                      );
                                      setValue(`${baseFormLabel}.${subItem.label}`, parseFloat(e));
                                    } else {
                                      setValue(`${baseFormLabel}.${subItem.label}`, null);
                                      setValue(
                                        `${baseFormLabel}.${subItem.label} Time Captured`,
                                        null,
                                      );
                                    }
                                  }}
                                  value={value}
                                  keyboardType={
                                    subItem.type == 'int' || subItem.type == 'float'
                                      ? 'number-pad'
                                      : 'default'
                                  }
                                />
                              </>
                            )}
                          />
                          <Controller
                            control={control}
                            name={baseFormLabel + '.' + subItem.label + ' Time Captured'}
                            value={null}
                            defaultValue={defaultVal[subItem.label + ' Time Captured'] || null}
                            render={() => (
                              <View
                                style={{
                                  paddingVertical: 10,
                                  paddingHorizontal: 5,
                                  backgroundColor: 'beige',
                                }}>
                                <Text style={{color: 'black', textAlign: 'center'}}>
                                  {timeConvert(
                                    doubleFieldTime(subIndex).toLocaleTimeString('en-US', {
                                      hour12: true,
                                    }),
                                  )}
                                </Text>
                              </View>
                            )}
                          />

                          {/* <Controller
                                            control={control}
                                            name={baseFormLabel + '.' +subItem.label+' Time Captured'}
                                            value={showDate?date.toISOString():null}
                                            // value={showDate?date.toJSON():null}
                                            defaultValue={showDate?date.toISOString():null}
                                            // defaultValue={showDate?date.toJSON():null}
                                            render={({ field:{onChange}}) => (
                                            <TouchableOpacity disabled={globalEdit? !showDate : !globalEdit} onPress={()=>setIsVisible(true)} style={{paddingVertical:10, paddingHorizontal:5, backgroundColor:'beige'}}>
                                                <Text style={{color:'black', textAlign:'center'}}>{showDate ? `Time: ${timeConvert(date.toLocaleTimeString('en-US', { hour12: true }))}` : ' - '}</Text>
                                                {
                                                  isVisible && 
                                                  <DateTimePicker 
                                                    value={date} 
                                                    is24Hour={false}
                                                    defaultValue={defaultVal[subItem.label+" Time Captured"]}
                                                    onChange={(event, selectedDate)=>{
                                                      setIsVisible(false);
                                                      if(event.type === 'set'){
                                                        setDate(selectedDate);
                                                        // setValue(`${baseFormLabel}.${subItem.label} Time Captured`, date.toJSON())
                                                      }
                                                      onChange(selectedDate.toISOString())
                                                      }
                                                    } 
                                                    mode="time" display="spinner" 
                                                  />
                                                }
                                            </TouchableOpacity>
                                              )}
                                          /> */}

                          {errors &&
                            errors[categorySchema.title] &&
                            errors[categorySchema.title] &&
                            errors[categorySchema.title][item.label] &&
                            errors[categorySchema.title][item.label][subItem.label] &&
                            errors[categorySchema.title][item.label][subItem.label].type !=
                              'required' && (
                              <Text style={{color: 'red'}}>
                                {errors[categorySchema.title][item.label][subItem.label].type} ERORR
                              </Text>
                            )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            }
          } else {
            //Radio Button Field Function
            if (item.type == 'option') {
              const [val, setVal] = useState(defaultVal ? defaultVal : null);
              return (
                <View style={{marginVertical: 12}} key={index}>
                  <Text style={{color: '#282C50', fontSize: 18}}>
                    {item.label}
                    <Text style={{color: 'red'}}>{item.regex.isRequired ? ' *' : ''}</Text>
                  </Text>
                  <Controller
                    control={control}
                    name={baseFormLabel}
                    defaultValue={val}
                    rules={rules(item.type, item.regex)}
                    render={({field: {onChange, value}}) => (
                      <>
                        <RadioButton.Group
                          onValueChange={val => {
                            setVal(val);
                            setValue(`${baseFormLabel}`, val);
                            onChange(val);
                          }}
                          value={value}>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <RadioButton
                              status={val == item.options[0] ? 'checked' : 'unchecked'}
                              value={item.options[0]}></RadioButton>
                            <Text style={{fontSize: 16}}>{item.options[0]}</Text>
                          </View>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <RadioButton
                              status={val == item.options[1] ? 'checked' : 'unchecked'}
                              value={item.options[1]}></RadioButton>
                            <Text style={{fontSize: 16}}>{item.options[1]}</Text>
                          </View>
                        </RadioButton.Group>
                      </>
                    )}
                  />
                  {errors && errors[baseFormLabel] && (
                    <Text style={{color: 'red'}}>
                      {errorMessage(errors[categorySchema.title][item.label].type)}
                      {console.log(errors)}
                    </Text>
                  )}
                </View>
              );
            } else if (item.type == 'time') {
              const l =
                defaultVal === null || defaultVal === '' || typeof defaultVal == 'undefined'
                  ? true
                  : false;
              const [date, setDate] = useState(
                defaultVal === '' || typeof defaultVal == 'undefined'
                  ? dateGlobal
                  : setInitDateTime(defaultVal),
              );
              return (
                <View style={{marginVertical: 12}} key={index}>
                  <Text style={{color: '#282C50', fontSize: 18}}>
                    {item.label}
                    <Text style={{color: 'red'}}>{item.regex.isRequired ? ' *' : ''}</Text>
                  </Text>
                  <Controller
                    control={control}
                    name={baseFormLabel}
                    render={({field: {onChange}}) => (
                      <SingleTimeField
                        foundDate={l}
                        onChange={onChange}
                        form={form}
                        label={item.label}
                        initialDate={date}
                        setDateFunction={setDate}
                      />
                    )}
                    defaultValue={defaultVal || null}
                    value={convertToCSharpCompatibleFormat(date)}
                    rules={rules(item.type, item.regex)}
                  />
                </View>
              );
            } else if (item.type == 'justTime') {
              var d;
              var label;
              if (defaultVal == '' || typeof defaultVal == 'undefined') {
                label = true;
                d = dateGlobal;
                d.setHours(0, 0, 0, 0);
              } else {
                label = false;
                d = setInitDateTime(defaultVal);
              }
              const l = label;
              const [date, setDate] = useState(d);
              return (
                <View style={{marginVertical: 12}} key={index}>
                  <Text style={{color: '#282C50', fontSize: 18}}>
                    {item.label}
                    <Text style={{color: 'red'}}>{item.regex.isRequired ? ' *' : ''}</Text>
                  </Text>
                  <Controller
                    render={({field: {onChange}}) => (
                      <StopWatchTimeField
                        foundDate={l}
                        onChange={onChange}
                        form={form}
                        label={item.label}
                        initialDate={date}
                        setDateFunction={setDate}
                      />
                    )}
                    control={control}
                    name={baseFormLabel}
                    defaultValue={defaultVal || null}
                    value={convertToCSharpCompatibleFormat(date)}
                    rules={rules(item.type, item.regex)}
                  />
                </View>
              );
            } else {
              //Typical Input Field Function
              const defaultVal1 = useRef(validateInitValue(retrievedData[item.label]));
              const isDescription = item.type === 'description' ? true : false;
              const MAX_LENGTH = maxLengthFilter(item.type, item?.regex?.max);
              const [charsLeft, setCharsLeft] = useState(MAX_LENGTH);

              return (
                <View style={{marginVertical: 12}} key={index}>
                  <Text style={{color: '#282C50', fontSize: 18}}>
                    {item.label}
                    <Text style={{color: 'red'}}>{item.regex.isRequired ? ' *' : ''}</Text>
                  </Text>
                  {isDescription && (
                    <Text>
                      Characters left:{' '}
                      <Text style={{color: charsLeft < 10 ? 'red' : '', fontWeight: 'bold'}}>
                        {charsLeft}
                      </Text>
                    </Text>
                  )}
                  <Controller
                    control={control}
                    name={baseFormLabel}
                    defaultValue={defaultVal1.current}
                    rules={(() => rules(item.type, item.regex))()}
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextInput
                        editable={globalEdit}
                        style={isDescription ? styles.description : styles.input}
                        placeholder={item.label}
                        onBlur={onBlur}
                        maxLength={MAX_LENGTH}
                        onChangeText={e => {
                          item.type == 'float' || item.type == 'int'
                            ? (() => {
                                // console.log("is not float: "+isNaN(parseFloat(e)));
                                // console.log("float value: "+parseFloat(e));
                                onChange(e);
                                if (isNaN(parseFloat(e))) {
                                  defaultVal1.current = e;
                                } else {
                                  setValue(`${baseFormLabel}`, parseFloat(e));
                                }
                              })()
                            : (() => {
                                setCharsLeft(MAX_LENGTH - e.length);
                                onChange(e);
                              })();
                        }}
                        value={value}
                        defaultValue={defaultVal1.current !== null ? '' + defaultVal1.current : ''}
                        // defaultValue={""+defaultVal1.current}
                        multiline={item.type == 'description' ? true : false}
                        keyboardType={
                          item.type == 'int' || item.type == 'float' ? 'number-pad' : 'default'
                        }
                      />
                    )}
                  />
                  {errors &&
                    errors[categorySchema.title] &&
                    errors[categorySchema.title][item.label] &&
                    errors[categorySchema.title][item.label].type != 'required' && (
                      <Text style={{color: 'red'}}>
                        {errorMessage(errors[categorySchema.title][item.label].type)}
                      </Text>
                    )}
                </View>
              );
            }
          }
        })}
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
  header: {
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
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  buttonText: {
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
    textAlignVertical: 'top',
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
    marginHorizontal: 10,
    marginTop: 30,
    marginBottom: 50,
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
    marginHorizontal: 10,
    marginTop: 30,
    marginBottom: 50,
  },
});
const validateInitValue = (value, valueType) => {
  if (value === null || value === undefined) {
    return valueType === 'string' ? '' : null;
  }

  if (valueType === 'float') {
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) ? parsedValue : null;
  }

  if (valueType === 'int') {
    const parsedValue = parseInt(value, 10);
    return !isNaN(parsedValue) ? parsedValue : null;
  }

  if (valueType === 'string') {
    return typeof value === 'string' ? value : null;
  }

  return value;
};
const validateInitDateTime = defaultVal => {
  if (defaultVal === null || defaultVal === undefined) {
    return false;
  }
  const date = new Date(defaultVal);
  if (isNaN(date)) {
    return false;
  }

  return true;
};
const rules = (type, regex = {}) => {
  if (type === 'int') {
    // console.log('int');
    return {
      pattern: /^[0-9]*$|^NULL$/,
      required: regex?.isRequired || false,
      min: regex.min || 0,
      max: regex.max || 10000,
    };
  } else if (type === 'float') {
    // console.log('float');
    return {
      pattern: /^[+-]?([0-9]*[.])?[0-9]+$/,
      required: regex?.isRequired || false,
      min: regex.min || 0,
      max: regex.max || 10000,
    };
  } else if (type === 'time') {
    return {
      required: true,
      valueAsDate: true,
      // validate:((value, formValues)=> console.log(value, formValues))(),
    };
  } else {
    // console.log('string');
    // console.log(type, regex.isRequired);
    return {
      required: regex?.isRequired || false,
    };
  }
};
const maxLengthFilter = (type, fieldMax) => {
  if (type === 'int') {
    return 10;
  } else if (type === 'float') {
    return 10;
  } else if (type === 'description') {
    return 80;
  } else if (type === 'string') {
    if (fieldMax) return fieldMax;
    return 20;
  } else return null;
};
const errorMessage = (type, regex = {}) => {
  if (type === 'min') {
    return 'The entered value is too SMALL';
  } else if (type === 'max') {
    return 'The entered value is too LARGE';
  } else if (type === 'pattern') {
    return "Please check value's FORMAT";
  } else {
    return 'This field is required for submission';
  }
};
const setInitDateTime = defaultVal => {
  if (defaultVal === null || defaultVal === undefined) {
    return new Date();
  }
  // date retrieved from storage converted to js syntax
  // const date = new Date(defaultVal);

  // Init date being returned

  // console.log('\n\n============= default date being passed ================');
  // console.log(defaultVal);
  const date = new Date(convertToJSCompatibleFormat(defaultVal));
  // console.log('=============Init date being returned ================');
  // console.log(date.toString());
  // console.log('================================================\n\n');

  if (isNaN(date)) {
    return new Date();
  }

  return date;
};
// Function to calculate the difference in hours and minutes
function calculateTimeDifference(start = '', end = '') {
  if (start === '' || end === '') {
    return ' - ';
  }

  let startMinutes = start.getHours() * 60 + start.getMinutes();
  let endMinutes = end.getHours() * 60 + end.getMinutes();

  let diff = endMinutes - startMinutes;

  if (diff < 0) {
    // Adjust if the end time is actually on the next day
    diff += 24 * 60;
    return ' Lights on cannot be negative';
  }

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours}h ${minutes}m`;
}
// Egg collection entry for 4 times
const fourFieldTime = idx => {
  let str = '';
  let currentDate = new Date();

  switch (idx) {
    case 0:
      str = '8:30:00';
      break;
    case 1:
      str = '10:30:00';
      break;
    case 2:
      str = '13:30:00';
      break;
    case 3:
      str = '15:30:00';
      break;
  }
  let [hours, minutes, seconds] = str.split(':').map(Number);

  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(seconds);

  return currentDate;
};
// Time specific collection for 2 entries
const doubleFieldTime = idx => {
  let str = '';
  let currentDate = new Date();

  switch (idx) {
    case 0:
      str = '6:00:00';
      break;
    case 1:
      str = '15:00:00';
      break;
  }
  let [hours, minutes, seconds] = str.split(':').map(Number);

  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(seconds);

  return currentDate;
};
