import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Text, View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAuth} from '../contexts/Auth';
import axios from 'axios';
import {APP_API, ENDPOINTS, FORM_STATUS_OBJ} from '../Constants';
import {convertToJSCompatibleFormat} from '../services/Helpers';
import LoadingScreen from '../components/LoadingModal';

const ReviewForm = ({route, navigation, back}) => {
  const auth = useAuth();
  const isFocused = useIsFocused();
  const {reviewType} = route.params;

  let farms = [];
  Object.keys(route.params.farms).map((item, index) => {
    farms.push(route.params.farms[item]);
  });
  farms.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();
    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  const [farmSelected, setFarmSelected] = useState('none');
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);
  const size = Object.keys(farms).length;

  useEffect(() => {
    // setLoading(true);
    size === 1
      ? (() => {
          console.log('one:  ');
          setFarmSelected(farms[0]);
          getForms(farms[0].id).then(setLoading(false));
        })()
      : 'none';
    if (isFocused)
      farmSelected != 'none'
        ? getForms(farmSelected.id).then(setLoading(false))
        : setLoading(false);
  }, []);

  useEffect(() => {
    if (farmSelected != 'none') {
      setLoading(true);
      getForms(farmSelected.id).then(() => {
        setLoading(false);
      });
    }
  }, [farmSelected]);

  useEffect(() => {
    setLoading(true);
    size === 1
      ? () => {
          setFarmSelected(farms[0]);
          getForms(farms[0].id).then(setLoading(false));
        }
      : 'none';
    if (isFocused)
      farmSelected != 'none'
        ? getForms(farmSelected.id).then(setLoading(false))
        : setLoading(false);
  }, [isFocused]);

  const FarmSelect = () => {
    if (size > 1) {
      return (
        <View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={styles.pickerLabel}>
              {farmSelected != 'none' ? 'Farm Selected:' : 'Select a Farm:'}
            </Text>
            <Picker
              style={{
                backgroundColor: 'white',
                color: farmSelected == 'none' ? 'grey' : 'black',
                height: 60,
                width: '80%',
              }}
              selectedValue={farmSelected}
              onValueChange={(selected, selectedIndex) =>
                (() => {
                  setFarmSelected(selected);
                })()
              }>
              <Picker.Item label="None" value="none" key={'none'} />
              {farms.map((farm, index) => {
                return <Picker.Item label={farm.name} value={farm} key={index} />;
              })}
            </Picker>
          </View>
          <Text style={{marginTop: 10, color: '#9EADD3', textAlign: 'center'}}>
            {farmSelected != 'none'
              ? ''
              : 'Select a Farm from the picker ABOVE to see form for REVIEW'}
          </Text>
        </View>
      );
    }
  };

  const SingleFarm = () => {
    return <Text style={{fontSize: 24, fontWeight: 'bold', color: '#282C50'}}></Text>;
  };

  const onClick = async item => {
    setLoading(true);
    if (reviewType === 'submission')
      await getForm(item.formId).then(e => {
        navigation.navigate('Review and Edit', {retrievedForm: e});
      });
    if (reviewType === 'reject')
      await getForm(item.formId).then(e => {
        navigation.navigate('Edit Rejected Form', {
          retrievedForm: e.Data,
          reasons: e.RejectReasons,
          farm: farmSelected,
        });
      });
    if (reviewType === 'review')
      await getForm(item.formId).then(e => {
        navigation.navigate('Form Review', {recievedData: e});
      });
  };

  const getForms = async farmId => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + auth.authData.token,
      },
      params: {
        farmId: farmId,
      },
    };
    return await axios
      .get(`${APP_API}${ENDPOINTS.GetSubmittedFormDetailsByFarmId}`, config)
      .then(response => {
        setFormList(formInfo(response.data[0]['TblFlockMt'], reviewType));
      })
      .catch(err => console.warn(err));
  };

  const getForm = async formId => {
    const config = {
      headers: {
        Authorization: 'bearer ' + auth.authData.token,
      },
      params: {formId: formId},
    };
    return await axios.get(`${APP_API}${ENDPOINTS.GetFormByFormId}`, config).then(response => {
      setLoading(false);
      return response.data;
    });
  };

  const FormTile = formObj => {
    const {createdBy, dateCreated, formId, house} = formObj;
    return (
      <TouchableOpacity
        key={Math.random()} //To Use formId
        onPress={() => {
          onClick(formObj);
        }}
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
          backgroundColor: 'white',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginBottom: 2,
        }}>
        <Text style={{fontSize: 15, color: '#ced4da'}}>
          Submitted By:{' '}
          <Text style={{fontWeight: '400', fontSize: 16, color: 'grey'}}>{createdBy}</Text>
        </Text>
        <Text style={{fontSize: 15, color: '#ced4da'}}>
          Date Created:{' '}
          <Text style={{fontWeight: '400', fontSize: 16, color: 'grey'}}>
            {convertToJSCompatibleFormat(dateCreated).toDateString()}
          </Text>
        </Text>
      </TouchableOpacity>
    );
  };

  const FormsList = forms => {
    let empty = true;
    return (
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', padding: 0, color: '#343a40'}}>
          {farmSelected.name}
        </Text>
        {forms.map((form, formIndex) => {
          if (form.house.trim().toUpperCase() !== 'HOUSE') {
            return (
              <View style={{marginBottom: 10}} key={formIndex}>
                {form.forms.length > 0 && (
                  <Text style={{fontSize: 17, marginTop: 0, marginBottom: 5, color: '#495057'}}>
                    {form.house.toUpperCase()}
                  </Text>
                )}
                <View>
                  {form.forms.length > 0
                    ? form.forms.map((i, idx) => {
                        // console.log(form.forms.length);
                        // console.log({house: form.house.toUpperCase(), ...i});
                        empty = false;
                        return FormTile({house: form.house.toUpperCase(), ...i});
                      })
                    : null}
                </View>
              </View>
            );
          }
        })}
        {empty && (
          <Text
            style={{
              fontSize: 15,
              color: '#adb5bd',
              backgroundColor: '#dee2e6',
              width: '100%',
              textAlign: 'center',
              textAlignVertical: 'center',
              height: 40,
            }}>
            No forms available for REVIEW for this farm
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>FARM SELECT</Text>
      <ScrollView>
        {!loading ? (
          <View>
            <View>{farms.length !== 1 && <FarmSelect />}</View>
            <View>{farmSelected != 'none' && FormsList(formList)}</View>
          </View>
        ) : (
          <LoadingScreen />
        )}
      </ScrollView>
    </View>
  );
};

export default ReviewForm;

const formInfo = (arrForms, reviewType) => {
  let formData = [];
  const statusMapping = {
    submission: FORM_STATUS_OBJ['Pre-Submitted'],
    review: FORM_STATUS_OBJ['Submitted'],
    default: FORM_STATUS_OBJ['Rejected'],
  };
  const statusFilter = statusMapping[reviewType] || statusMapping.default;

  for (let houseObj of arrForms) {
    const house = `House ${houseObj['HouseNo'].trim()}`;
    let formDetails = {house: house, forms: []};

    for (let form of houseObj['TblFlockDetails']) {
      if (form.StatusId == statusFilter) {
        const formDet = {
          formId: form.FormId,
          dateCreated: form.DateCreated,
          createdBy: form.CreatedByName,
          statusId: form.StatusId,
        };
        // add form details object to forms array
        formDetails.forms.push(formDet);
      }
    }

    // Sort forms by date created
    formDetails.forms.sort((a, b) => {
      return new Date(b.dateCreated) - new Date(a.DateCreated);
    });

    // return complete form object to forms array
    formData.push(formDetails);
  }

  //Sorts formData by house number
  formData.sort((a, b) => a.house.localeCompare(b.house));
  return formData;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    backgroundColor: '#E0E8FC',
  },
  header: {
    color: '#282C50',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  pickerLabel: {
    color: 'black',
    fontSize: 20,
    paddingLeft: 10,
    padding: 10,
  },
});
