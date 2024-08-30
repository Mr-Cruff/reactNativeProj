import React, {useEffect, useState} from 'react';
import {Text, Image, View, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import {convertToJSCompatibleFormat, jamaicanDateFormat, RedTrashCan} from '../services/Helpers';
import {FORM_STATUS_OBJ} from '../Constants';
import LoadingScreen from '../components/LoadingModal';
import {getAllFormsFromAsync, deleteFormByFormId} from '../services/FormManagement';
import {ResetForms} from '../services/AsyncStorage';

const EditFormSelect = ({navigation, back, route}) => {
  const [loading, setLoading] = useState(true);
  const [allForms, setAllForms] = useState([]);
  const [formsToView, setFormsToVIew] = useState(FORM_STATUS_OBJ[-1]);
  const farms = route.params.farms;

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      const fetchForms = async () => {
        setLoading(true); // Set loading state to true
        try {
          const forms = await getAllFormsFromAsync(); // Await the async function
          setAllForms(forms || []); // Set the state after the async function resolves
        } catch (error) {
          console.error('Error fetching forms:', error);
          setAllForms(allForms || []); // Handle the error by setting forms to null
        } finally {
          setLoading(false); // Set loading state to false after fetching is complete
        }
      };
      fetchForms();
    });

    return () => focusHandler; // Cleanup the listener when the component unmounts
  }, [navigation]);

  useEffect(() => {
    allForms ? setLoading(false) : setLoading(true);
  }, [allForms]);

  //Switch between displaying Submitted forms and Incompolete forms
  const toggleFormView = () => {
    setFormsToVIew(current =>
      current === FORM_STATUS_OBJ[-1] ? 'Submitted' : FORM_STATUS_OBJ[-1],
    );
  };
  //Gets Forms all forms from async storage and returns an array of forms
  // const getFromsFromAsync = async () => {
  //   await AsyncStorage.getItem('@forms').then(
  //     onResolved => {
  //       setAllForms(JSON.parse(onResolved));
  //       setLoading(false);
  //     },
  //     onRejected => {
  //       // Do something else on failure
  //       Alert.alert('Error !', `Unable to load forms, try again.`);
  //       setAllForms(null);
  //     },
  //   );
  // };
  //Retrieves and navigates to the selected form for editing
  const formSelected = form => {
    let selectedFarmHouse = {Farm: '', House: ''};
    const farms = route.params.farms;

    farms.forEach(farm => {
      if (form['Farm'] === farm['name']) {
        const house = farm['houses'].find(
          house => form['House'].toLowerCase() === house['name'].toLowerCase(),
        );

        if (house) {
          selectedFarmHouse = {Farm: farm, House: house};
        }
      }
    });

    // Uncomment this once you are ready to navigate
    navigation.navigate('Edit Form', {
      formSelected: form,
      farmSelected: selectedFarmHouse,
    });
  };
  //Alert confirming the user's intention of deleting the selected form
  const deleteFormConfirmation = formId => {
    Alert.alert(`Warning`, `Are you sure you want to delete this form?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: `Yes, delete`,
        onPress: async () => setAllForms((await deleteFormByFormId(formId)) || []),
      },
    ]);
  };
  //Label displaying the number of unsubmitted forms currently on the device
  const NumberOfFormsSaved = ({size}) => {
    return (
      <Text
        style={{
          alignSelf: 'center',
          color: '#9EADD3',
          fontSize: 16,
          marginTop: 10,
        }}>
        There {size === 1 ? 'is' : 'are'}{' '}
        <Text style={{fontSize: 16, color: '#17817d'}}>{size}</Text> {size === 1 ? 'form' : 'forms'}{' '}
        saved on this device that need to be submitted
      </Text>
    );
  };
  //navigation button for creating forms
  const CreateFormButton = farms => {
    const path = 'Create Form';
    const location = require('../resources/newForm.png');
    return (
      <TouchableOpacity
        style={styles.actionButton}
        onPress={props => navigation.navigate(path, {farms})}>
        <Image source={location} />
      </TouchableOpacity>
    );
  };

  let tempCount = 0;
  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingScreen loading={loading} message={`Loading`} />
      ) : (
        <>
          <Text
            style={{
              fontSize: 32,
              color: '#282C50',
              fontWeight: 'bold',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            SAVED FORMS
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: '#9EADD3',
              fontWeight: '400',
              alignSelf: 'center',
              marginBottom: 20,
            }}>
            All forms saved on this device can be found below
          </Text>
          <View
            style={{
              backgroundColor: 'beige',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginHorizontal: -20,
              paddingVertical: 10,
            }}>
            <View style={{justifyContent: 'center', marginRight: 50}}>
              <Text style={{color: '#9d9549'}}>Want to enter values for a new form?</Text>
              <Text style={{fontSize: 24, color: '#282C50', fontWeight: 'bold'}}>
                Create a new form here
              </Text>
            </View>
            <CreateFormButton farms={farms} />
          </View>
          <TouchableOpacity
            style={{
              marginTop: 20,
              paddingHorizontal: 25,
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}
            onPress={toggleFormView}>
            <Text style={{fontSize: 20, fontWeight: 'normal', color: '#282C50'}}>
              {formsToView === FORM_STATUS_OBJ[0] ? FORM_STATUS_OBJ[1] : formsToView} Forms
            </Text>
          </TouchableOpacity>
          <View style={{height: '72%'}}>
            <ScrollView style={styles.innerContainer}>
              {allForms !== null ? (
                Object.keys(allForms).map((form, formIndex) => {
                  if (
                    allForms[formIndex]['Status'].toLowerCase().includes(formsToView.toLowerCase())
                  ) {
                    tempCount += 1;
                    return (
                      <View key={formIndex}>
                        <TouchableOpacity
                          onPress={() => {
                            formSelected(allForms[formIndex]);
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              backgroundColor: '#ffff',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              elevation: 3,
                              borderRadius: 10,
                              padding: 10,
                              margin: 10,
                            }}>
                            <View style={{width: '88%'}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      color: 'grey',
                                      marginLeft: 10,
                                    }}>
                                    {tempCount}.
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      color: 'black',
                                      fontWeight: 'bold',
                                      marginHorizontal: 10,
                                      width: 170,
                                    }}>
                                    {allForms[formIndex]['Farm']}
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: 'black',
                                    marginHorizontal: 10,
                                  }}>
                                  {allForms[formIndex]['House']?.toUpperCase()}
                                </Text>
                                <Text style={{fontSize: 16, marginHorizontal: 10}}>
                                  Created By: {allForms[formIndex]['Created By']}
                                </Text>
                                <Text style={{fontSize: 16, marginHorizontal: 10}}>
                                  <Text
                                    style={{
                                      color: 'black',
                                      fontWeight: 'bold',
                                    }}>
                                    {jamaicanDateFormat(
                                      convertToJSCompatibleFormat(
                                        allForms[formIndex]['Date Created'],
                                      ),
                                    )}
                                  </Text>
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={{margin: 5, alignSelf: 'flex-end'}}
                              onPress={() =>
                                deleteFormConfirmation(allForms[formIndex]['Form Id'])
                              }>
                              <RedTrashCan />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }
                })
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    color: '#6C82BB',
                    fontWeight: '400',
                    alignSelf: 'center',
                    marginVertical: 10,
                  }}>
                  No Forms Found, create a new form to begin.
                </Text>
              )}
            </ScrollView>
          </View>
          <NumberOfFormsSaved size={tempCount} />
          <Text
            style={{
              fontSize: 18,
              color: '#6C82BB',
              fontWeight: ' ',
              alignSelf: 'center',
              marginBottom: 10,
            }}>
            Please remember to SUBMIT all completed forms
          </Text>
        </>
      )}
    </View>
  );
};

export default EditFormSelect;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 20,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    backgroundColor: '#E0E8FC',
  },
  innerContainer: {
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#282C50',
    color: '#ffff',
    borderRadius: 10,
    padding: 10,
    width: 150,
  },
});
