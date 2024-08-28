/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Header from '../components/Header';

class FarmSelect extends Component {
  state = {farm: ''};
  updateFarm = farm => {
    this.setState({farm: farm});
    this.props.navigation.navigate('House Select', {
      selectedFarmType: this.props.route.params.selectedFarmType,
      selectedFarm: farm,
    });
  };

  render() {
    return (
      <View>
        <Header />
        <Text style={styles.head}>Please Select your farm</Text>
        <Picker selectedValue={this.state.farm} onValueChange={this.updateFarm}>
          <Picker.Item label="Select a Farm" value="none" />
          <Picker.Item label="Farm 1" value="Farm 1" />
          <Picker.Item label="Farm 2" value="Farm 2" />
          <Picker.Item label="Farm 3" value="Farm 3" />
          <Picker.Item label="Farm 4" value="Farm 4" />
          <Picker.Item label="Farm 5" value="Farm 5" />
          <Picker.Item label="Farm 6" value="Farm 6" />
          <Picker.Item label="Farm 7" value="Farm 7" />
          <Picker.Item label="Farm 8" value="Farm 3" />
          <Picker.Item label="Farm 9" value="Farm 9" />
          <Picker.Item label="Farm 10" value="Farm 10" />
          <Picker.Item label="Farm 11" value="Farm 11" />
          <Picker.Item label="Farm 12" value="Farm 12" />
        </Picker>
        {/*<Text style={styles.text}>{this.state.farm}</Text>*/}
      </View>
    );
  }
}
export default FarmSelect;

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
