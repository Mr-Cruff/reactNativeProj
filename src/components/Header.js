/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

const Header = props => {
  return (
    <View style={styles.header}>
      <Image
        source={require('C:/Users/Chriz/Documents/My Projects (Practice)/ReactNative/reactNativeProj/src/resources/ipb.png')}
        style={styles.img}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    paddingTop: 10,
    paddingBottom: 20,
    marginBottom: 20,
  },
  img: {
    resizeMode: 'cover',
    height: 90,
    width: 600,
  },
});

export default Header;
