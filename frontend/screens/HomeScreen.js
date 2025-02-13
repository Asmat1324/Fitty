import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import HomeCard from '../components/HomeCard';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Fitty" subtitle="Your fitness tracker" />
      </Appbar.Header>

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
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default HomeScreen;