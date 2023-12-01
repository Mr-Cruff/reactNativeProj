import React, { useState } from 'react';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

import {IconedButton, WhitePlus} from '../services/Helpers';
import { Divider } from 'react-native-paper';
const img = require('../resources/grow_tile.png')

export const FarmTile = ({farm}) => {
  // console.log(JSON.stringify(farm))
  const bgColor =
    farm.type == 'Production'
      ? {text: '#EABFBF', bg: '#F8F2F2'}
      : {text: '#C8EAC2', bg: '#EFF4EF'};
  const [touched, setTouched] = useState(false);

  const container = {
    paddingTop:10,
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
        <TouchableOpacity onPress={()=>setTouched(!touched)}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#282C50',
              padding: 20,
              borderRadius: 10,
              justifyContent:'space-around'
            }}>
            <Image source={require('../resources/FarmLogo.png')} style={{ width: 90, height: 75, zIndex:-1}} />
            <View style={styles.farmNameContainer}>
              <Text style={styles.farmName}> {farm.name} </Text>
               <View style={{alignItems:'center'}}>
                <View style={{marginVertical:10}}>
                  <Text style={highlightText}>{farm.type}</Text>
                </View>
                <View style={{flexDirection: 'row',flexWrap:'wrap', justifyContent:'space-evenly'}}>
                  <View style={{marginTop:5,flexDirection:'row',alignItems:'center', color:'white'}}><Text style={{color:'white',}}>Feed Received: </Text><RenderValue value={farm.feedReceived} bgColor={bgColor} /></View>
                  <View style={{marginTop:5,flexDirection:'row',alignItems:'center', color:'white'}}><Text style={{color:'white',}}>Days in Inventory: </Text><RenderValue value={farm.daysInInventory} bgColor={bgColor} /></View>
                  {/* <View style={{marginTop:5,flexDirection:'row',alignItems:'center', color:'white'}}><Text style={{color:'white',}}>Birds Brought Forward: </Text><RenderValue value={farm.birdsBroughtForwardFemale} bgColor={bgColor} /><RenderValue value={farm.birdsBroughForwardMale} bgColor={bgColor} /><RenderValue value={farm.birdsBroughForward} bgColor={bgColor} /></View> */}
                </View>
               {!touched && 
               <View style={{flexDirection: 'row',alignItems:'center'}}>
                  <WhitePlus size={32}/>
                  <Text style={{color:'white', fontSize:15, fontWeight:'300'}}>see more</Text>
                </View>
               }
              </View>
            </View>
          </View>        
        </TouchableOpacity>
        {/* <FarmTile_refactor farm={farm} /> */}
      </View>
        {
          touched && (farm.houses).map((house, houseIndex) =>
          (
            <View key={houseIndex} style={{marginLeft: 20, paddingVertical:10}}>
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
              <View style={{flexDirection: 'row', flexWrap:'wrap', justifyContent:'flex-start'}}>
                {/* <Text style={styles.listText}>Farm Type: </Text>
                <Text style={highlightText}>{farm.type}</Text> */}
                {/* <Text style={styles.listText}>Age of Birds: </Text>
                <Text style={highlightText}>{house.flockAge} Weeks</Text> */}
                <RenderLabelValue label={"Flock Number: "} value={house.flockNumber} bgColor={bgColor} />
                <RenderLabelValue label={"Age of Birds: "} value={house.flockAge} suffix={"Weeks"} bgColor={bgColor}/>
                <RenderLabelValue label={"Flock Breed: "} value={house.flockBreed} bgColor={bgColor} />
                {farm.type.toLowerCase()!="grow" &&<RenderLabelValue label={"Birds Brought Forward: "} value={house.birdsBroughtForward} bgColor={bgColor} />}
                {/* <RenderLabelValue label={"Flock Started: "} value={house.flockStarted} bgColor={bgColor} /> */}
                <View style={{flexDirection:'row', marginTop:10, justifyContent:'center'}}>
                  <Text style={styles.listText}>Flock Started: </Text>
                  <RenderValue value={house.flockStartedMale} suffix={"Males"} bgColor={bgColor} />
                  <RenderValue value={house.flockStartedFemale} suffix={"Females"} bgColor={bgColor} />
                  <RenderValue value={house.flockStarted} suffix={"TOTAL"} bgColor={bgColor} />
                </View>
                {
                  farm.type.toLowerCase()!="grow" && 
                  <View style={{flexDirection:'row', marginTop:10, justifyContent:'center'}}>
                    {/* <Text style={styles.listText}>Flock Housed: </Text>
                    <RenderValue value={house.flockHoused} bgColor={bgColor} /> */}
                    <Text style={styles.listText}>Flock Housed: </Text>
                    <RenderValue value={house.flockHousedMale} suffix={"Males"} bgColor={bgColor} />
                    <RenderValue value={house.flockHousedFemale} suffix={"Females"} bgColor={bgColor} />
                  </View>
                
                }
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
              {(houseIndex != (farm.houses).length -1) &&
              <View style={{paddingTop:20, justifyContent:'center'}}>
              <View style={{ width:'60%', alignSelf:'center'}}>
                <Divider bold={true}/>
              </View>
              </View>
              }
            </View>
          )
        )}
      </View> 
    );
  else{
    return(
      <View
       style={{
         alignItems: 'center',
         backgroundColor: '#282C50',
         padding: 20,
         borderRadius: 10,
         justifyContent:'space-around',
         margin:20
       }}>
          <Image source={require('../resources/FarmLogo.png')} style={{ width: 90, height: 75, zIndex:-1}} />
          <View style={styles.farmNameContainer}>
            <Text style={styles.farmName}> {farm.name} </Text>
             <View style={{alignItems:'center'}}>
              <View style={{marginVertical:10}}>
                <Text style={highlightText}>{farm.type}</Text>
              </View>
            </View>
          </View>
              <Text style={[styles.highlightText,{color:'grey'}]}>No Flock data is available for this farm</Text>
        </View>        
 
    )
  }
};

// export const FarmTile_refactor =({farm}) => {
//   return (
//     <View style={{marginVertical:10, flexDirection:'row', backgroundColor:'#F2F5FF',width:700, elevation:3,}}>
//       <Image source={img} style={{flex:1}} />
//       <View style={{justifyContent:'space-between', flex:2, padding:10, paddingHorizontal:20}}>
//         <View>
//           <Text style={[styles.farmName, {color:'#085710', textAlign:'center'}]}>Maryland Farm 20 </Text>
//         </View>
//         <View style={{flexDirection:'column', flexWrap:'wrap'}}>
//           <Text style={{color:'#282C50', fontWeight:'bold', fontSize:20}}>Production</Text>
//           <View style={{flexDirection:'row',}}>
//             <Text style={styles.listText}>Feed Received (lbs): </Text>
//             <Text style={styles.highlightText}>20</Text>
//             <Text style={styles.listText}>Days in Inventory: </Text>
//             <Text style={styles.highlightText}>25</Text>
//           </View>
//         </View>
//         <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
//          <WhitePlus size={32}/><Text style={{color:'grey', fontSize:15, fontWeight:'300'}}>see more</Text>
//         </View>
//       </View>
//     </View>
//   )
// }

const NotFound = () =>
  <Text style={[styles.highlightText,{color:'grey'}]}>Not Found</Text>

const RenderValue = ({ value, bgColor, suffix="" }) =>
  value?
    <Text style={[styles.highlightText,{backgroundColor:bgColor?.text}]}>{value} {suffix}</Text>
    :
    <NotFound />

const RenderLabelValue = ({label, value, bgColor, suffix=""}) =>{
  return (
    <View style={{flexDirection:'row', marginTop:10}}>
      <Text style={styles.listText}>{label}</Text>
      <RenderValue value={value} suffix={suffix} bgColor={bgColor} />
    </View>
  )
}

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
    backgroundColor: "#dfdfdf",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 15,
  },
  farmName:{
    color: '#ffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  farmNameContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 125,
    maxWidth: 2500,
  }
});
