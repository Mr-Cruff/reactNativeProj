import React, {useState} from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

export const SubFields = () => {
  const {control, handleSubmit} = useForm({mode: 'onBlur'});

  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);
  const [val3, setVal3] = useState(0);
  const [val4, setVal4] = useState(0);
  let total = val1 + val2 + val3 + val4;
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        defaultValue=""
        name="Entry1"
        render={({field: {onChange, value, onBlur}}) => (
          <TextInput
            style={styles.input}
            placeholder="Enter 1st Entry"
            value={value}
            onBlur={onBlur}
            keyboardType="number-pad"
            onChangeText={value => {
              setVal1(Number(value));
              return onChange(value);
            }}
          />
        )}
      />
      <Controller
        control={control}
        defaultValue=""
        name="2nd Entry"
        render={({field: {onChange, value, onBlur}}) => (
          <TextInput
            style={styles.input}
            placeholder="Enter 2nd Entry"
            value={value}
            onBlur={onBlur}
            keyboardType="number-pad"
            onChangeText={value => {
              setVal2(Number(value));
              return onChange(value);
            }}
          />
        )}
      />
      <Controller
        control={control}
        defaultValue=""
        name="3rd Entry"
        render={({field: {onChange, value, onBlur}}) => (
          <TextInput
            style={styles.input}
            placeholder="Enter 3rd Entry"
            value={value}
            onBlur={onBlur}
            keyboardType="number-pad"
            onChangeText={value => {
              setVal3(Number(value));
              return onChange(value);
            }}
          />
        )}
      />
      <Controller
        control={control}
        defaultValue=""
        name="4th Entry"
        render={({field: {onChange, value, onBlur}}) => (
          <TextInput
            style={styles.input}
            placeholder="Enter 3rd Entry"
            value={value}
            onBlur={onBlur}
            keyboardType="number-pad"
            onChangeText={value => {
              setVal4(Number(value));
              return onChange(value);
            }}
          />
        )}
      />
      <Text>{total}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
