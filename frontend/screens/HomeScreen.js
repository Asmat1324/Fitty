import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import HomeCard from '../components/HomeCard';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HomeCard />
        <Button mode="contained" style={styles.button} onPress={() => console.log('Track Workouts')}>
          Track Workouts
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 2,
  },
  button: {
    marginTop: 2,
  },
});

export default HomeScreen;