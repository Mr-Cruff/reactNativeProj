import React from 'react';
import {TextInput as RNTextInput, View, StyleSheet} from 'react-native';

export default function InputField({...otherProps}) {
  const validationColor = '#223e4b';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        borderRadius: 8,
        borderColor: validationColor,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 8,
      }}>
      <View>
        <RNTextInput
          underlineColorAndroid="transparent"
          placeholderTextColor="rgba(34, 62, 75, 0.7)"
          placeholder={otherProps.placeholder}
          onChangeText={otherProps.onChangeText}
          {...otherProps}
        />
      </View>
    </View>
  );
}
