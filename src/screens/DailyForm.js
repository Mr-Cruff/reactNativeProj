/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Header from '../components/Header';

//HOME SCREEN
const DailyForm = ({route, navigation}) => {
  const [state, setState] = useState({house: ''});
  const {selectedFarmType, selectedFarm, selectedHouse} = route.params;

  const [number, onChangeNumber] = React.useState(null);

  const updateHouse = house => {
    setState({house: house});
  };
  let today = new Date();
  let date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  const handlePress = () => {
    Alert.alert('Notification', 'Form Submitted');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.subgroup1}>
            <Text style={styles.text}>
              Farm Type:{'  '}
              <Text style={{fontWeight: 'bold', color: '#002B36'}}>
                {selectedFarmType}
              </Text>
            </Text>
            <Text style={styles.text}>
              Farm:{'  '}
              <Text style={{fontWeight: 'bold', color: '#002B36'}}>
                {selectedFarm}
              </Text>
            </Text>
            <Text style={styles.text}>
              House:{'  '}
              <Text style={{fontWeight: 'bold', color: '#002B36'}}>
                {selectedHouse}
              </Text>
            </Text>
          </View>
          <View style={styles.subgroupPicker}>
            <Picker selectedValue={state.house} onValueChange={updateHouse}>
              <Picker.Item label="Change House" value="none" />
              <Picker.Item label="House 1" value="house1" />
              <Picker.Item label="House 2" value="house2" />
              <Picker.Item label="Male / House 1B" value="house1b" />
            </Picker>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginBottom: 40,
            marginTop: 10,
          }}
        />

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={{fontSize: 25}}>
            Daily {selectedFarmType} Farm Record
          </Text>
        </View>
        {separator()}
        <View
          style={{
            backgroundColor: '#C3DCCD',
            font: 22,
            padding: 10,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{}}>
              <Text style={styles.text}>
                Flock #:{'   '}
                <Text style={{fontWeight: 'bold', color: '#002B36'}}>5489</Text>
              </Text>
              <Text style={styles.text}>
                Birds Overhead:{'   '}
                <Text style={{fontWeight: 'bold', color: '#002B36'}}>
                  54434589
                </Text>
              </Text>
              <Text style={styles.text}>
                Date:{'   '}
                <Text style={{fontWeight: 'bold', color: '#002B36'}}>
                  {date}
                </Text>
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                Males:{'   '}
                <Text style={{fontWeight: 'bold', color: '#002B36'}}>3054</Text>
              </Text>
              <Text style={styles.text}>
                Females:{'   '}
                <Text style={{fontWeight: 'bold', color: '#002B36'}}>549</Text>
              </Text>
              <Text style={styles.text}>
                Age:{'   '}
                <Text style={{fontWeight: 'bold', color: '#002B36'}}>34</Text>
              </Text>
            </View>
          </View>
        </View>

        {separator()}
        <View style={styles.subgroup}>
          <Text>Water Consumption:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={number}
            placeholder="Water Consumption"
            keyboardType="numeric"
          />
        </View>

        <View>
          <Text style={styles.subgroupLabel}>Feed:</Text>
          <View style={styles.group}>
            <View style={styles.subgroup}>
              <Text>Feed Recieved:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Feed Recieved"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.subgroup}>
              <Text>Feed Used:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Feed Used"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {separator()}

        <View>
          <Text style={styles.subgroupLabel}>Mortality:</Text>
          <View style={styles.group}>
            <View style={styles.subgroup}>
              <Text>Mortality:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Mortalities"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.subgroup}>
              <Text>Cull:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Culls"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {separator()}
        <View>
          <Text style={styles.subgroupLabel}>Vaccination:</Text>
          <View style={styles.group}>
            <View style={styles.subgroup}>
              <Text>Vaccination Type:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Type"
              />
            </View>
            <View style={styles.subgroup}>
              <Text>Vaccination Quantity:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Quantity"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {separator()}
        <View>
          <Text style={styles.subgroupLabel}>Medication:</Text>
          <View style={styles.group}>
            <View style={styles.subgroup}>
              <Text>Medication Type:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Type"
              />
            </View>
            <View style={styles.subgroup}>
              <Text>Medication Quantity:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Quantity"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {separator()}
        <View>
          <Text style={styles.subgroupLabel}>Temperature:</Text>
          <View style={styles.group}>
            <View style={styles.subgroup}>
              <Text>Temperature Min:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Type"
              />
            </View>
            <View style={styles.subgroup}>
              <Text>Temperature Max:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Quantity"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {separator()}

        <View>
          <Text style={styles.subgroupLabel}>Lights:</Text>
          <View style={styles.group}>
            <View style={styles.subgroup}>
              <Text>Hours On:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Hours Lights On"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.subgroup}>
              <Text>Hours Off:</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Hours Lights Off"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <Button onPress={handlePress} title="Submit" color="red" />
      </ScrollView>
    </View>
  );
};

export default DailyForm;

const separator = () => {
  return (
    <View
      style={{
        height: 1,
        width: '50%',
        backgroundColor: '#ffff',
        marginLeft: '25%',
        marginTop: '1%',
        marginBottom: '1%',
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    fontSize: 18,
    paddingRight: 30,
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#6A927B',
    borderWidth: 1,
    width: 200,
  },
  subgroupLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexGap: 10,
  },
  subgroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    justifyContent: 'space-between',
  },
  subgroup1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subgroupPicker: {
    width: '25%',
    justifyContent: 'flex-end',
  },
});
