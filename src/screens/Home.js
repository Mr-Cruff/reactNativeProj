import React, {useEffect, useState, useContext} from 'react';
import {ActivityIndicator, Text, View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useAuth} from '../contexts/Auth';
import {FarmTile, ButtonPanel, ProfileComponent, HeaderComponent} from '../components/Dashboard';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {APP_API} from '../Constants.tsx';
import LinearGradient from 'react-native-linear-gradient';
import {ShowAlert} from '../services/Helpers';
import {GlobalContext} from '../contexts/GlobalContext';
import {getFarmsFromAsync, storeFarms} from '../services/AsyncStorage';
import {Loading} from '../components/Loading';
import formFields from '../dataSources/FormSchema.js';
import {ENDPOINTS} from '../Constants.tsx';

//HOME SCREEN
const Home = ({navigation}) => {
  // Rerender home page on screen changes
  const auth = useAuth();
  const [netInfo, setNetInfo] = useState(null);
  const [farms, setFarms] = useState(undefined);
  const {role, name, email, uuid} = useAuth().authData;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const global = useContext(GlobalContext);
  const pkg = require('../../package.json');

  // Move buttons to another file
  const signOut = () => {
    auth.signOut();
  };

  // Internet state management
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo(state.isConnected && state.isInternetReachable ? 'Online' : 'Offline');
      global.setInternetAvailable(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (farms !== undefined) {
      global.setFormSchema(formFields);
      setLoading(false);
    }
  }, [farms]);

  // Get farms for user
  const getFarms = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${auth.authData.token}`,
      },
      timeout: 5000,
    };

    // Farm URL
    const farmUrl = `${APP_API}${ENDPOINTS.GetFarmsByUserId}${uuid}`;
    let farmArray = null;
    let asyncFarmArray = null;

    try {
      const {data} = await axios.get(farmUrl, config);
      farmArray = data.map(farm => ({
        id: farm.FarmId,
        farmNo: farm.FarmNo.trim(),
        name: farm.FarmName.trim(),
        type: farm.FarmStage === 1 ? 'Grow' : 'Production',
        feedReceived: farm.FeedReceived ? Number(farm.FeedReceived.toFixed(2)) : null,
        daysInInventory: farm.DaysInInventory ? Number(farm.DaysInInventory.toFixed(2)) : null,
        houses: farm.TblFlockMt.filter(
          house => house.FarmId === farm.FarmId && house.HouseNo.trim() !== '',
        )
          .map(house => ({
            house: house.HouseNo.trim(),
            name: `House ${house.HouseNo.trim()}`,
            type: farm.FarmStage === 1 ? 'Grow' : 'Production',
            flockAge: house.FlockAge,
            flockNumber: house.FlockNumber.trim(),
            complexEntityNo: house.ComplexEntityNo.trim(),
            flockHoused: house.FlockHoused,
            flockHousedMale: house.FlockHousedMale,
            flockHousedFemale: house.FlockHousedFemale,
            flockStarted: house.FlockStarted,
            flockStartedMale: house.FlockStartedMale,
            flockStartedFemale: house.FlockStartedFemale,
            birdsBroughtForward: house.BirdBroughForward,
            birdsBroughForwardMale: house.BirdsBroughForwardMale,
            birdsBroughForwardFemale: house.BirdsBroughForwardFemale,
            flockBreed: house.BreedName.trim(),
            flockBreedNo: house.BreedNo.trim(),
          }))
          .sort((a, b) => a.house.localeCompare(b.house)),
      }));
    } catch (error) {
      //console.warn("Failed to fetch farms from API:", error.message);
    }

    // If farms were not retrieved from the API, load the user's farms from local storage
    if (!farmArray) {
      try {
        asyncFarmArray = await getFarmsFromAsync(uuid);
      } catch (error) {
        console.error('Failed to load farms from local storage:', error.message);
      }
    }

    // Update state and global context with the farms data
    if (farmArray) {
      setFarms(farmArray);
      global.setFarms(farmArray);
      storeFarms(uuid, farmArray);
    } else if (asyncFarmArray) {
      setFarms(asyncFarmArray);
      global.setFarms(asyncFarmArray);
      ShowAlert(
        `Error`,
        `Failed to load farms from API, User's farms loaded from local storage instead.`,
      );
    } else {
      setFarms(null);
      ShowAlert(`Error`, `Failed to load farms from API and local storage.`);
    }

    setLoading(false);
    setRefresh(false);
  };

  useEffect(() => {
    getFarms();
  }, [netInfo]);

  return !loading ? (
    <View style={styles.container}>
      <HeaderComponent netInfo={netInfo} />
      <View style={{flex: 1}}>
        <LinearGradient colors={['#edf2fb', '#ccdbfd']}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefresh(true);
                  getFarms();
                }}
              />
            }>
            <View style={{paddingBottom: 50}}>
              <Text style={styles.dashboardLabel}>DASHBOARD</Text>
              <Text style={styles.welcomeLabel}>Welcome, </Text>
              <ProfileComponent
                signoutButtonStyle={styles.button}
                email={email}
                name={name}
                role={role}
                signoutButtonFunction={signOut}
              />
              <View
                style={{
                  paddingTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 30, color: '#282C50', fontWeight: 'bold'}}>MY FARMS</Text>
                <View style={{flex: 1, marginHorizontal: 30}}>
                  <View style={{minHeight: 550}}>
                    {loading ? (
                      <ActivityIndicator size="large" color="red" />
                    ) : farms && farms.length > 0 ? (
                      farms.map((farm, index) => <FarmTile farm={farm} key={index} />)
                    ) : (
                      <NoFarmsFound />
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
      <ButtonPanel navigation={navigation} role={role} farms={farms} pkg={pkg} />
    </View>
  ) : (
    <Loading />
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E8FC',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#6B0C0C',
    // backgroundColor: '#FFC700',
    padding: 10,
    borderRadius: 5,
    marginLeft: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282C50',
    color: '#ffff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    marginLeft: 20,
  },
  dashboardLabel: {
    marginLeft: '10%',
    marginTop: 10,
    fontSize: 34,
    fontWeight: '500',
    color: 'black',
  },
  welcomeLabel: {
    marginLeft: '10%',
    marginTop: 20,
    fontSize: 24,
    color: 'black',
  },
});
