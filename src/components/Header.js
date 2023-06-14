/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

const Header = props => {
  return (
    <View style={styles.header}>
      <Image source={require('../resources/ipb.png')} style={styles.img} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    paddingVertical: 10,
    marginBottom: 10,
  },
  img: {
    // resizeMode: 'cover',
    // height: 90,
    // width: 600,
  },
});

export default Header;
