/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {useAuth} from '../contexts/Auth';
import Header from '../components/Header';
//HOME SCREEN
const Home = ({navigation}) => {
  const auth = useAuth();

  const signOut = () => {
    auth.signOut();
  };

  //Access Login data
  //console.log(auth);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            paddingTop: 10,
            backgroundColor: 'white',
          }}>
          <Header />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 10,
            }}>
            <Text style={{fontSize: 18}}>Welcome, {auth.authData.name}</Text>
            <TouchableOpacity style={styles.button} onPress={signOut}>
              <Text style={{color: 'white'}}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{paddingTop: 30, paddingHorizontal: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity
              onPress={() => {
                alert('you clicked me');
              }}>
              <Image source={require('../resources/GoToForms.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Farm Type Select')}>
              <Image source={require('../resources/GoToForms.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                alert('you clicked me');
              }}>
              <Image source={require('../resources/GoToForms.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{paddingTop: 30, paddingHorizontal: 20, flexDirection: 'row'}}>
          <View style={{backgroundColor: '#002B36', width: '30%'}}>
            <TouchableOpacity
              onPress={() => {
                alert('you clicked me');
              }}>
              <Image source={require('../resources/FarmLogo.png')} />
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}>
              <Text
                style={{
                  color: '#980000',
                  fontSize: 25,
                  fontWeight: 'bold',
                  margin: 0,
                }}>
                Farm 3
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              width: '70%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#C1B48D',
                flexWrap: 'wrap',
                paddingVertical: 10,
                width: '100%',
              }}>
              <Text style={{color: '#000000', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{paddingTop: 30, paddingHorizontal: 20, flexDirection: 'row'}}>
          <View style={{backgroundColor: '#002B36', width: '30%'}}>
            <TouchableOpacity
              onPress={() => {
                alert('you clicked me');
              }}>
              <Image source={require('../resources/FarmLogo.png')} />
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}>
              <Text
                style={{
                  color: '#980000',
                  fontSize: 25,
                  fontWeight: 'bold',
                  margin: 0,
                }}>
                Farm 3
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              width: '70%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#C1B48D',
                flexWrap: 'wrap',
                paddingVertical: 10,
                width: '100%',
              }}>
              <Text style={{color: '#000000', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{paddingTop: 30, paddingHorizontal: 20, flexDirection: 'row'}}>
          <View style={{backgroundColor: '#002B36', width: '30%'}}>
            <TouchableOpacity
              onPress={() => {
                alert('you clicked me');
              }}>
              <Image source={require('../resources/FarmLogo.png')} />
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}>
              <Text
                style={{
                  color: '#980000',
                  fontSize: 25,
                  fontWeight: 'bold',
                  margin: 0,
                }}>
                Farm 3
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              width: '70%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#C1B48D',
                flexWrap: 'wrap',
                paddingVertical: 10,
                width: '100%',
              }}>
              <Text style={{color: '#000000', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
              <Text style={{color: '#144529', fontSize: 18, padding: 20}}>
                Water Consumption:{'   '}
                <Text style={{fontWeight: 'bold', color: 'red'}}>237</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#C3DCCD',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#980000',
    color: 'white',
    padding: 10,
  },
});
