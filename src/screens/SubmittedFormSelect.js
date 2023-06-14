import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';


const FarmHouseSelect = ({route, back}) => {
  const farms = route.params.myFarms;
  const navigation = useNavigation();
  const [farmSelected, setFarmSelected] = useState('none');
  const [houseSelected, setHouseSelected] = useState('none');
  const [farmHouse, setFarmHouse] = useState(null);

  const FarmSelect = () => {
    if (farms.length > 1) {
      let farmNames=[];
      return (
        <View>
          <Text
            style={{
              fontSize: 20,
              paddingLeft: 10,
              padding: 10,
            }}>
            Select a Farm
          </Text>
          <Picker
            style={{backgroundColor: 'white', height: 60}}
            selectedValue={farmSelected}
            onValueChange={(farmName, farmIndex) => setFarmSelected(farmName)}>
            <Picker.Item label="Select a Farm" value="none" key={'none'} />
            {farms.map((farm, index) => {
              if(farmNames.includes(farm.name)){
              }else{
                farmNames=[...farmNames, farm.name];
                return(
                  <Picker.Item label={farm.name} value={index} key={index} />
                );
            }

          })}
          </Picker>
        </View>
      );
    } 
    // else {
    //   setFarmSelected(farms[0]);

    //   return <Text>{farms[0].name}</Text>;
    // }
  };

  const SingleFarm = () => {
    return <Text style={{fontSize:24, fontWeight:'bold', color:'#282C50'}}>{farms[0].name}</Text>;
  }

  const HouseSelect = () => {
    return (
      <View style={{marginTop: 20}}>
        <Text
          style={{
            fontSize: 20,
            color:'#282C50',
            paddingLeft: 10,
            padding: 10,
          }}>
          Select Farm House
        </Text>
        <Picker
          style={{backgroundColor: 'white', height: 60}}
          selectedValue={houseSelected}
          onValueChange={(itemValue, itemIndex) => {
            itemValue != 'none'
              ? setFarmHouse({
                  Farm: farms[farmSelected],
                  House: farms[farmSelected].houses[itemValue],
                })
              : '';
            setHouseSelected(itemValue);
          }}>
          <Picker.Item label="Select a House" value="none" key="none" />
          {farms[farmSelected].houses.map((house, houseIndex) => (
            <Picker.Item
              label={house.name}
              value={houseIndex}
              key={houseIndex}
            />
          ))}
        </Picker>
      </View>
    );
  };

  useEffect(() => {
    //updateHouse();
    //console.log(houseSelected);
    if (
      farmSelected != 'none' &&
      houseSelected != 'none' &&
      farmHouse != null
    ) {
      navigation.navigate('New Form', farmHouse);
    }
  });

  useEffect(() => {
    farms.length == 1 ? setFarmSelected(0) : "none";
  },[]);

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: '#282C50',
          fontSize: 32,
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: 10,
        }}>
        FARM SELECT
      </Text>
      {farms.length != 1 ? <FarmSelect /> : <SingleFarm />}
      {farmSelected != 'none' ? (
        <>
          <HouseSelect />
        </>
      ) : (
        ''
      )}
    </View>
  );
};

export default FarmHouseSelect;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    backgroundColor: '#E0E8FC',
  },
});
