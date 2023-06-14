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
  console.log(route.params)
  const { farms } = route.params;
  const navigation = useNavigation();
  const [farmSelected, setFarmSelected] = useState('none');
  const [houseSelected, setHouseSelected] = useState('none');
  const [farmHouse, setFarmHouse] = useState(null);
  const FarmSelect = () => {
    if (farms.length > 1) {
      let farmNames=[];
      return (
        <View>
          <Picker
            style={{backgroundColor: 'white', height: 60, marginTop:20}}
            selectedValue={farmSelected}
            onValueChange={(farmName, farmIndex) => {setHouseSelected('none'); setFarmSelected(farmName)}}>
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
          <Text style={{marginTop:10, color:'#9EADD3', textAlign:'center'}}>{(farmSelected != 'none') ? '': 'Select a Farm from the picker ABOVE to see form for REVIEW'}</Text>
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
        <Text style={{marginBottom:10, color:'#9EADD3', textAlign:'center'}}>{(farmSelected == 'none' || houseSelected != 'none') ? '': 'Sdddddddelect a House from the picker BELOW to move forward'}</Text>
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
      {farmSelected != 'none' && <HouseSelect />}
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
