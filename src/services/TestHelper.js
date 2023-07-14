import React from 'react';

if (item.type === 'multi-field') {
    const fields = item.fields.map((field, index) => {
      const defaultValue = defaultVal[field.label] !== undefined ? defaultVal[field.label] : 0;
      const defaultTime = typeof defaultVal[`${item.fields[0].label} Time Captured`] == "undefined" ? new Date(): defaultVal[item.fields[0].label] == "" ? new Date() : new Date(defaultVal[`${item.fields[0].label} Time Captured`])
  
      const [value, setValue] = useState(defaultValue);
      const [date, setDate] = useState(new Date());
      const [isVisible, setIsVisible] = useState(false);
  
      useEffect(() => {
        setValue(typeof defaultValue === 'number' ? defaultValue : 0);
      }, [defaultValue]);
  
      useEffect(() => {
        setValue(baseFormLabel + '.' + field.label, value);
        const updatedDate = new Date(date);
        const updatedDateJSON = updatedDate.toJSON();
        setDate(baseFormLabel + '.' + field.label + ' Time Captured', updatedDate);
        defaultVal[field.label] = Number(value);
        defaultVal[`${field.label} Time Captured`] = updatedDateJSON;
      }, [value, date]);
        console.log(date);
      return (
        <View key={index} style={{flex:0.9}}>
          {/* <View style={{ height: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}> */}
            <View>
              <Controller
                control={control}
                defaultValue={defaultValue > 0 ? defaultValue : null}
                name={baseFormLabel + '.' + field.label}
                rules={(() => rules(field.type, field.regex))()}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    editable={globalEdit}
                    style={[styles.input, {marginRight:10}]}
                    placeholder="Enter Entry"
                    value={value}
                    defaultValue={defaultValue > 0 ? defaultValue.toString() : ''}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    onChangeText={value => {
                      const newDate = new Date();
                      onChange(value);
                      setValue(Number(value));
                      setDate(newDate);
                      defaultVal[field.label] = Number(value);
                      defaultVal[`${field.label} Time Captured`] = newDate.toJSON();
                    }}
                  />
                )}
              />
              {/* ...additional code for time captured and error handling */}
            {/* </View> */}
          </View>
        </View>
      );
    });
  
    const total = fields.reduce((acc, field) => acc + field.value, 0);
  
    useEffect(() => {
      setValue(baseFormLabel + '.' + item.label + ' Total', total);
    }, [total]);
  
    return (
      <View style={{ marginVertical: 12 }}>
          <Text style={{ color: '#282C50', fontSize: 18 }}>
            {item.label}
            <Text style={{ color: 'red' }}>{item.fields[0].regex.isRequired ? ' *' : ''}</Text>
          </Text>
        <View style={{
          flex:1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {fields}
        </View>
        <Text style={{ fontSize: 18 }}>Total {item.label}: {total}</Text>
      </View>
    );
  }


if (item.type === 'multi-field') {   
    const fieldFunc = item.fields.map((subItem, subIndex) => {
        const [valueState, setValueState] = useState(validateInitValue(defaultVal[`${item.fields[subIndex].label}`], subItem.type));
        const [date, setDate] = useState(defaultVal[`${item.fields[subIndex].label} Time Captured`] == "" ? new Date() : isNaN(new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`])) ? new Date() : new Date(defaultVal[`${item.fields[subIndex].label} Time Captured`]));
        const [isVisible, setIsVisible] = useState(false);
        return(
            <View style={{width:'24%'}} key={subIndex}>
              <Controller
                key={subIndex}
                control={control}
                defaultValue={validateInitValue(defaultVal[`${item.fields[subIndex].label}`], subItem.type)}
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
                      // onChangeText={(e) => {
                      //   onChange(e); 
                      //   if(e !== ""){
                      //     setValue(`${baseFormLabel}.${subItem.label} Time Captured`, (new Date).toJSON()); 
                      //     setValue(`${baseFormLabel}.${subItem.label}`, parseFloat(e));
                      //   }else{
                      //     defaultVal[subItem.label]=e
                      //   }
                      // }}
                      onChangeText={value => {
                        // console.log('this is onChange');
                        const newDate = new Date();
                        onChange(value); 
                        setValue(`${baseFormLabel}.${subItem.label} Time Captured`, newDate.toJSON());
                        setValue(`${baseFormLabel}.${subItem.label}`, Number(value));
                        setValueState(Number(value));
                        setDate(newDate);
                        defaultVal[`${item.fields[subIndex].label} Time Captured`]=newDate.toJSON();
                      }}  
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
    }); 
    const total = fieldFunc.reduce((acc, field) => acc + field.value, 0);
  
    useEffect(() => {
      setValue(baseFormLabel + '.' + item.label + ' Total', total);
    }, [total]);                
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