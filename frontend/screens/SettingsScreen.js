import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';


const SettingsScreen = (navigation) => {
  return (
    <View>
    <Text onPress={() => navigation.navigate('Home')}
           style={{fontSize: 26, fontWeight: 'bold'}}>Settings Screen</Text>
    </View>
  );
};


export default SettingsScreen;