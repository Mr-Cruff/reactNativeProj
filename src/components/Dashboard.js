import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  NewFormIcon,
  EditFormIcon,
  WhiteTick,
  WhiteX,
  WhitePlus,
  CalnderIcon,
  jamaicanDateFormat,
  UserProfileIcon,
} from '../services/Helpers';
import {Divider} from 'react-native-paper';
import {APP_ROLES, WEEKDAY} from '../Constants';
import Header from '../components/Header';
/* 
  This file has components (mostly UI components) used on the Dashboard
*/

export const FarmTile = ({farm}) => {
  // console.log(JSON.stringify(farm))
  const bgColor =
    farm.type == 'Production' ? {text: '#EABFBF', bg: '#F8F2F2'} : {text: '#C8EAC2', bg: '#EFF4EF'};
  const [touched, setTouched] = useState(false);

  const container = {
    paddingTop: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'column',
    backgroundColor: bgColor.bg,
    padding: 15,
    borderRadius: 10,
    // maxWidth: 1000,
    elevation: 3,
  };

  const highlightText = {
    textAlign: 'center',
    fontSize: 20,
    color: '#282C50',
    fontWeight: 'bold',
    backgroundColor: bgColor.text,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 15,
  };

  if (farm.houses.length)
    return (
      <View style={container}>
        <View>
          <TouchableOpacity onPress={() => setTouched(!touched)}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#282C50',
                padding: 20,
                borderRadius: 10,
                justifyContent: 'space-around',
              }}>
              <Image
                source={require('../resources/FarmLogo.png')}
                style={{width: 90, height: 75, zIndex: -1}}
              />
              <View style={styles.farmNameContainer}>
                <Text style={styles.farmName}> {farm.name} </Text>
                <View style={{alignItems: 'center'}}>
                  <View style={{marginVertical: 10}}>
                    <Text style={highlightText}>{farm.type}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-evenly',
                    }}>
                    <View
                      style={{
                        marginTop: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        color: 'white',
                      }}>
                      <Text style={{color: 'white'}}>Feed Received: </Text>
                      <RenderValue value={farm.feedReceived} bgColor={bgColor} />
                    </View>
                    <View
                      style={{
                        marginTop: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        color: 'white',
                      }}>
                      <Text style={{color: 'white'}}>Days in Inventory: </Text>
                      <RenderValue value={farm.daysInInventory} bgColor={bgColor} />
                    </View>
                    {/* <View style={{marginTop:5,flexDirection:'row',alignItems:'center', color:'white'}}><Text style={{color:'white',}}>Birds Brought Forward: </Text><RenderValue value={farm.birdsBroughtForwardFemale} bgColor={bgColor} /><RenderValue value={farm.birdsBroughForwardMale} bgColor={bgColor} /><RenderValue value={farm.birdsBroughForward} bgColor={bgColor} /></View> */}
                  </View>
                  {!touched && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <WhitePlus size={32} />
                      <Text style={{color: 'white', fontSize: 15, fontWeight: '300'}}>
                        see more
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {/* <FarmTile_refactor farm={farm} /> */}
        </View>
        {touched &&
          farm.houses.map((house, houseIndex) => (
            <View key={houseIndex} style={{marginLeft: 20, paddingVertical: 10}}>
              <View>
                <Text
                  style={{
                    color: '#282C50',
                    fontSize: 24,
                    fontWeight: 'bold',
                  }}>
                  House {house.house}
                </Text>
              </View>
              <View>
                {/* <View style={{flexDirection: 'row', justifyContent:'space-around'}}> */}
                <View
                  style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                  {/* <Text style={styles.listText}>Farm Type: </Text>
                <Text style={highlightText}>{farm.type}</Text> */}
                  {/* <Text style={styles.listText}>Age of Birds: </Text>
                <Text style={highlightText}>{house.flockAge} Weeks</Text> */}
                  <RenderLabelValue
                    label={'Flock Number: '}
                    value={house.flockNumber}
                    bgColor={bgColor}
                  />
                  <RenderLabelValue
                    label={'Age of Birds: '}
                    value={house.flockAge}
                    suffix={'Weeks'}
                    bgColor={bgColor}
                  />
                  <RenderLabelValue
                    label={'Flock Breed: '}
                    value={house.flockBreed}
                    bgColor={bgColor}
                  />
                  {farm.type.toLowerCase() != 'grow' && (
                    <RenderLabelValue
                      label={'Birds Brought Forward: '}
                      value={house.birdsBroughtForward}
                      bgColor={bgColor}
                    />
                  )}
                  {/* <RenderLabelValue label={"Flock Started: "} value={house.flockStarted} bgColor={bgColor} /> */}
                  <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
                    <Text style={styles.listText}>Flock Started: </Text>
                    <RenderValue
                      value={house.flockStartedMale}
                      suffix={'Males'}
                      bgColor={bgColor}
                    />
                    <RenderValue
                      value={house.flockStartedFemale}
                      suffix={'Females'}
                      bgColor={bgColor}
                    />
                    <RenderValue value={house.flockStarted} suffix={'TOTAL'} bgColor={bgColor} />
                  </View>
                  {farm.type.toLowerCase() != 'grow' && (
                    <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
                      {/* <Text style={styles.listText}>Flock Housed: </Text>
                    <RenderValue value={house.flockHoused} bgColor={bgColor} /> */}
                      <Text style={styles.listText}>Flock Housed: </Text>
                      <RenderValue
                        value={house.flockHousedMale}
                        suffix={'Males'}
                        bgColor={bgColor}
                      />
                      <RenderValue
                        value={house.flockHousedFemale}
                        suffix={'Females'}
                        bgColor={bgColor}
                      />
                    </View>
                  )}
                </View>
                {/* <View style={{flexDirection: 'row'}}>
                <Text style={styles.listText}>Birds Brought Forward: </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={highlightText}>
                    {farm.birdBroughForwardMale} Males
                  </Text>
                  <Text style={highlightText}>
                    {farm.birdBroughForwardFemale} Females
                  </Text>
                </View>
              </View> */}
              </View>
              {houseIndex != farm.houses.length - 1 && (
                <View style={{paddingTop: 20, justifyContent: 'center'}}>
                  <View style={{width: '60%', alignSelf: 'center'}}>
                    <Divider bold={true} />
                  </View>
                </View>
              )}
            </View>
          ))}
      </View>
    );
  else {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#343a40',
          padding: 20,
          borderRadius: 10,
          justifyContent: 'space-around',
          margin: 20,
        }}>
        <Image
          source={require('../resources/FarmLogo.png')}
          style={{width: 90, height: 75, zIndex: -1}}
        />
        <View style={styles.farmNameContainer}>
          <Text style={styles.farmName}> {farm.name} </Text>
          <View style={{alignItems: 'center'}}>
            <View style={{marginVertical: 10}}>
              <Text style={highlightText}>{farm.type}</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.highlightText, {color: 'grey'}]}>
          No Flock data is available for this farm
        </Text>
      </View>
    );
  }
};

// Internet Status Display Bar
const InternetStatus = ({status}) => {
  const bgColor = status == 'Online' ? '#0C5A40' : status == 'Offline' ? '#560909' : 'grey';
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: bgColor,
      }}>
      <Text style={{color: 'white'}}>{status}</Text>
    </View>
  );
};

export const HeaderComponent = ({netInfo}) => (
  <View style={{paddingTop: 10, backgroundColor: 'white'}}>
    <Header />
    <InternetStatus status={netInfo} />
  </View>
);
//Value not found display component
const NotFound = () => <Text style={[styles.highlightText, {color: 'grey'}]}>Not Found</Text>;
//Value only display component
const RenderValue = ({value, bgColor, suffix = ''}) =>
  value ? (
    <Text style={[styles.highlightText, {backgroundColor: bgColor?.text}]}>
      {value} {suffix}
    </Text>
  ) : (
    <NotFound />
  );
//Value and Label display component
const RenderLabelValue = ({label, value, bgColor, suffix = ''}) => (
  <View style={{flexDirection: 'row', marginTop: 10}}>
    <Text style={styles.listText}>{label}</Text>
    <RenderValue value={value} suffix={suffix} bgColor={bgColor} />
  </View>
);

//No farms found display component
export const NoFarmsFound = () => (
  <View
    style={{
      backgroundColor: '#ced4da',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: 30,
      borderRadius: 20,
    }}>
    <Text style={{fontSize: 20, color: '#495057', fontWeight: 'bold', marginBottom: 10}}>
      NO FARMS
    </Text>
    <Text style={{textAlign: 'center', flexWrap: 'wrap', width: 550}}>
      You don't seem to have any farms assigned to you, please contact your System Administrator for
      assistance.
    </Text>
  </View>
);
// -------- Buttons for button panel
//Create and Edit Button
const RoundButtonNew = ({navigation, path, farms, props}) => {
  return (
    <TouchableOpacity
      style={{width: 100, margin: 10}}
      onPress={() => navigation.navigate(path, {farms})}>
      <LinearGradient
        colors={['#5c9ead', '#326273']}
        style={{
          height: 100,
          width: 100,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 60,
        }}>
        <NewFormIcon size={58} />
      </LinearGradient>
      <Text style={{textAlign: 'center', color: '#282C50', fontSize: 16, fontWeight: '400'}}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};
//Submission Review Button
const RoundButtonEdit = ({navigation, path, farms, props}) => {
  return (
    <TouchableOpacity
      style={{width: 100, margin: 10}}
      onPress={() => navigation.navigate(path, {farms: farms, reviewType: 'submission'})}>
      <LinearGradient
        colors={['#fec89a', '#ef8354']}
        style={{
          height: 100,
          width: 100,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 50,
        }}>
        <EditFormIcon size={54} />
      </LinearGradient>
      <Text style={{textAlign: 'center', color: '#282C50', fontSize: 16, fontWeight: '400'}}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};
//Review Forms Button
const RoundButtonTick = ({navigation, path, farms, props}) => {
  return (
    <TouchableOpacity
      style={{width: 100, margin: 10}}
      onPress={() => navigation.navigate(path, {farms: farms, reviewType: 'review'})}>
      <LinearGradient
        colors={['#3a6ea5', '#004e98']}
        style={{
          height: 100,
          width: 100,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 60,
        }}>
        <WhiteTick size={54} />
      </LinearGradient>
      <Text style={{textAlign: 'center', color: '#282C50', fontSize: 16, fontWeight: '400'}}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};
//Rejected Forms Button
const RoundButtonX = ({navigation, path, farms, props}) => {
  return (
    <TouchableOpacity
      style={{width: 100, margin: 10}}
      onPress={() => navigation.navigate(path, {farms: farms, reviewType: 'reject'})}>
      <LinearGradient
        colors={['#f87060', '#D34848']}
        style={{
          height: 100,
          width: 100,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 60,
        }}>
        <WhiteX size={54} />
      </LinearGradient>
      <Text style={{textAlign: 'center', color: '#282C50', fontSize: 16, fontWeight: '400'}}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

//Button Panel, shows buttons based on roles.
//ToDo: Should change this to allow buttons based on stack
// export const ButtonPanel = ({ navigation, role, farms, pkg })=>{
//   if (Object.keys(APP_ROLES).includes(role)){
//     return(
//       <View style={{backgroundColor:'#EFF5FF',  justifyContent:'space-evenly', alignContent:'center', elevation:10,}}>
//         <View>
//           <Text style={{textAlign:'center', fontSize:20, color:'#282C50', marginTop:5, fontWeight:'bold'}}>FORMS PANEL</Text>
//           <Text style={{textAlign:'center', fontSize:14, color:'#8AB4CD', fontWeight:'400'}}>All form actions can be done here</Text>
//         </View>
//         <View style={{backgroundColor:'#EFF5FF', marginBottom:0, justifyContent:'space-evenly', flexDirection: 'row', alignContent:'center',}}>
//           {(role == APP_ROLES[0] || role == APP_ROLES[3] || role == APP_ROLES[4]) ? <RoundButtonNew navigation={navigation} path="Edit Form Select" farms={farms} props={{label:'Create & Edit'}}/>:null}
//           {(role == APP_ROLES[0] || role == APP_ROLES[4] ) ? <RoundButtonEdit path="Review Form" navigation={navigation}  farms={farms} props={{label:'Submission Review'}}/>:null}
//           {(role == APP_ROLES[0] || role == APP_ROLES[1] || role == APP_ROLES[2]) ? <RoundButtonTick navigation={navigation}  path="Review Form" farms={farms} props={{label:'Review Forms'}}/>: null}
//           {(role == APP_ROLES[0] || role == APP_ROLES[3] || role == APP_ROLES[4]) ? <RoundButtonX navigation={navigation}  path="Rejected Forms" farms={farms} props={{label:'Rejected Forms'}}/>: null}
//         </View>
//         <Text style={{paddingHorizontal:10, textAlign:'right', marginTop:-20}}>V. {pkg.version}</Text>
//       </View>
//     )
//   }else{
//     return(
//       <View style={{backgroundColor:'#EFF5FF',  justifyContent:'space-evenly', alignContent:'center', elevation:10, paddingBottom:'2%'}}>
//         <View>
//           <Text style={{textAlign:'center', fontSize:20, color:'#282C50', marginVertical:10, fontWeight:'bold'}}>FORMS PANEL</Text>
//           {/* <Text style={{textAlign:'center', fontSize:14, color:'#8AB4CD', fontWeight:'400'}}>All form actions can be done here</Text>  */}
//         </View>
//         <View style={{backgroundColor:'#EFF5FF', marginBottom:10, alignItems:'center',}}>
//           <View style={{backgroundColor:'pink',padding:'1%', alignItems:'center',borderRadius:10, width:'80%'}}>
//             <Text style={{fontSize:15, fontWeight:'500'}}>There appears to be something wrong with the role you've been assigned.</Text>
//             <Text>In order to access the application, you may need to update your role. To do so, kindly seek the help of the System Administrator for assistance.</Text>
//           </View>
//         </View>
//       </View>
//     );
//   }
// }
export const ButtonPanel = ({navigation, role, farms, pkg}) => {
  const renderRoleButtons = () => {
    return (
      <View style={styles.buttonContainer}>
        {(role === APP_ROLES[0] || role === APP_ROLES[3] || role === APP_ROLES[4]) && (
          <RoundButtonNew
            navigation={navigation}
            path="Edit Form Select"
            farms={farms}
            props={{label: 'Create & Edit'}}
          />
        )}
        {(role === APP_ROLES[0] || role === APP_ROLES[4]) && (
          <RoundButtonEdit
            navigation={navigation}
            path="Review Form"
            farms={farms}
            props={{label: 'Submission Review'}}
          />
        )}
        {(role === APP_ROLES[0] || role === APP_ROLES[1] || role === APP_ROLES[2]) && (
          <RoundButtonTick
            navigation={navigation}
            path="Review Form"
            farms={farms}
            props={{label: 'Review Forms'}}
          />
        )}
        {(role === APP_ROLES[0] || role === APP_ROLES[3] || role === APP_ROLES[4]) && (
          <RoundButtonX
            navigation={navigation}
            path="Review Form"
            farms={farms}
            props={{label: 'Rejected Forms'}}
          />
        )}
      </View>
    );
  };

  const renderInvalidRoleMessage = () => (
    <View style={styles.invalidRoleContainer}>
      <Text style={styles.invalidRoleText}>
        There appears to be something wrong with the role you've been assigned.
      </Text>
      <Text>
        In order to access the application, you may need to update your role. Kindly seek the help
        of the System Administrator for assistance.
      </Text>
    </View>
  );

  if (Object.keys(APP_ROLES).includes(role)) {
    return (
      <View style={styles.panelContainer}>
        <View>
          <Text style={styles.panelTitle}>FORMS PANEL</Text>
          <Text style={styles.panelSubtitle}>All form actions can be done here</Text>
        </View>
        {renderRoleButtons()}
        <Text style={styles.versionText}>Version {pkg.version}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.panelContainer}>
        <View>
          <Text style={styles.panelTitle}>FORMS PANEL</Text>
        </View>
        <View style={styles.invalidRoleWrapper}>{renderInvalidRoleMessage()}</View>
      </View>
    );
  }
};
// -------------------------------

// ------------------------------ Profile Display Components
//Calendar UI component shown on dashboard
const CalendarComponent = ({props}) => (
  <>
    <CalnderIcon size={72} />
    <View>
      <Text style={{color: '#9F9ECC', fontSize: 16, marginVertical: 0, paddingVertical: 0}}>
        {jamaicanDateFormat()}
      </Text>
      <Text style={{color: 'white', fontSize: 28}}>
        {WEEKDAY[new Date().getDay()].toUpperCase()}
      </Text>
    </View>
  </>
);
//Profile Icon and user information
const UserProfile = ({props}) => (
  <>
    <UserProfileIcon size={72} />
    <View>
      <Text style={{fontSize: 20, color: '#FFC700'}}>{props.name}</Text>
      <Text style={{fontSize: 14, color: '#AAAAAA'}}>{props.email.toUpperCase()}</Text>
      <Text style={{fontSize: 14, color: '#FFFFFF'}}>{props.role.toUpperCase()}</Text>
    </View>
  </>
);
//Sign Out Button
const SignOutButton = ({style, signOut}) => (
  <>
    <TouchableOpacity style={style} onPress={signOut}>
      <Text
        style={{
          color: '#A66363',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        SIGN OUT
      </Text>
    </TouchableOpacity>
  </>
);
//Profile Component with Calendar compoentns and Signout Button
export const ProfileComponent = ({
  name,
  email,
  role,
  signoutButtonStyle,
  signoutButtonFunction,
}) => (
  <View
    style={{
      backgroundColor: '#282C50',
      width: 'auto',
      justifyContent: 'space-around',
      alignSelf: 'center',
      borderRadius: 10,
      marginBottom: 30,
    }}>
    <View
      style={{
        borderRadius: 10,
        backgroundColor: '#282C50',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginRight: '2%'}}>
        <UserProfile props={{name, email, role}} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minWidth: '40%',
          justifyContent: 'space-around',
        }}>
        <View style={{marginRight: 5, flexDirection: 'row', alignItems: 'center'}}>
          <CalendarComponent />
        </View>
        <SignOutButton style={signoutButtonStyle} signOut={signoutButtonFunction} />
      </View>
    </View>
  </View>
);

//Styles
const styles = StyleSheet.create({
  listText: {
    fontSize: 18,
    minWidth: 120,
  },
  highlightText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#282C50',
    fontWeight: 'bold',
    backgroundColor: '#dfdfdf',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 15,
  },
  farmName: {
    color: '#ffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  farmNameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 125,
    maxWidth: 2500,
  },
  //Button Panel
  panelContainer: {
    backgroundColor: '#EFF5FF',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    elevation: 10,
  },
  buttonContainer: {
    backgroundColor: '#EFF5FF',
    marginBottom: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignContent: 'center',
  },
  panelTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: '#282C50',
    marginTop: 5,
    fontWeight: 'bold',
  },
  panelSubtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#8AB4CD',
    fontWeight: '400',
  },
  versionText: {
    padding: 5,
    textAlign: 'center',
    marginTop: -20,
    paddingBottom: 5,
    backgroundColor: '#343a40',
    color: 'grey',
  },
  invalidRoleWrapper: {
    backgroundColor: '#EFF5FF',
    marginBottom: 10,
    alignItems: 'center',
  },
  invalidRoleContainer: {
    backgroundColor: 'pink',
    padding: '1%',
    alignItems: 'center',
    borderRadius: 10,
    width: '80%',
  },
  invalidRoleText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
