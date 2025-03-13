import React, {useState} from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { List } from 'react-native-paper';
//hi 

const NotificationScreen = ({navigation}) => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <View style ={styles.container}>
    <Text
           style={styles.title}>Notifications</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default NotificationScreen;