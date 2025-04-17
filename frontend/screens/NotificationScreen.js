import React, {useState} from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { List } from 'react-native-paper';
import {useTheme} from '../utilities/ThemeContext';

const NotificationScreen = ({navigation}) => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <View style ={styles.container}>
    <Text
           style={styles.title}>Notifications</Text>
    </View>
  );
};

const getStyles =(theme)=> StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.text,
  },
});

export default NotificationScreen;