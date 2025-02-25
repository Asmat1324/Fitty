import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';


const DetailsScreen = (navigation) => {
  return (
    <View>
    <Text onPress={() => navigation.navigate('Home')}
           style={{fontSize: 26, fontWeight: 'bold'}}>Details Screen</Text>
    </View>
  );
};


export default DetailsScreen;