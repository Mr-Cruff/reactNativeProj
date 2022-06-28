/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Header from '../components/Header';

class FarmTypeSelect extends Component {
  state = {farmtype: ''};
  updateFarmType = farmtype => {
    this.setState({farmType: farmtype});
    this.props.navigation.navigate('Farm Select', {
      selectedFarmType: farmtype,
    });
  };

  render() {
    return (
      <View>
        <Header />
        <Text style={styles.head}>Please Select the farm type</Text>
        <Picker
          selectedValue={this.state.farmType}
          onValueChange={this.updateFarmType}>
          <Picker.Item label="Select Farm Type" value="none" />
          <Picker.Item label="Pullet Farm" value="Pullet" />
          <Picker.Item label="Production Farm" value="Breeder" />
        </Picker>
        {/*<Text style={styles.text}>{this.state.house}</Text>*/}
      </View>
    );
  }
}
export default FarmTypeSelect;

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
