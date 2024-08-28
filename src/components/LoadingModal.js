import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';

const LoadingScreen = ({ isLoading, message = "Loading..." }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={isLoading}>
      <View style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="red" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Adds a semi-transparent overlay
  },
  loader: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#282C50',
  },
});

export default LoadingScreen;