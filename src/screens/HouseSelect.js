/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Header from '../components/Header';

//HOME SCREEN
const HouseSelect = ({route, navigation}) => {
  const [state, setState] = useState({house: ''});

  const updateHouse = house => {
    setState({house: house});
    navigation.navigate('Daily Form', {
      selectedFarmType: route.params.selectedFarmType,
      selectedFarm: route.params.selectedFarm,
      selectedHouse: house,
    });
  };

  return (
    <View>
      <Header />
      <Text style={styles.head}>Please Select a house</Text>
      <Picker selectedValue={state.house} onValueChange={updateHouse}>
        <Picker.Item label="Select a House" value="none" />
        <Picker.Item label="House 1" value="House 1" />
        <Picker.Item label="House 2" value="House 2" />
        <Picker.Item label="Male / House 1B" value="House 1B" />
      </Picker>
      {/*<Text style={styles.text}>{this.state.house}</Text>*/}
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    alignSelf: 'center',
    color: 'red',
  },
  head: {
    fontSize: 18,
    padding: 10,
  },
});

export default HouseSelect;
