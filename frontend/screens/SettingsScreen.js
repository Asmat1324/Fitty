import React, {useState} from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { List } from 'react-native-paper';
//hi 

const SettingsScreen = ({navigation}) => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <View style ={styles.container}>
    <Text
           style={styles.title}>Settings Screen</Text>
    <List.Section>
      <List.Item
      title="Account"
      description="Manage account settings"
      left={() => <List.Icon icon="account" />}
      onPress={() => navigation.navigate('trackerScreen')}
      />
      <List.Item
          title="Notifications"
          description="Enable/disable notifications"
          left={() => <List.Icon icon="bell" />}
          onPress={() => navigation.navigate('trackerScreen')}
        />
        <List.Item
          title="Privacy"
          description="Update your privacy preferences"
          left={() => <List.Icon icon="lock" />}
          onPress={() => navigation.navigate('PrivacyScreen')}
        />
        <List.Item
          title="Dark Mode"
          left={() => <List.Icon icon="theme-light-dark" />}
          // right is used here to render a Switch component on the right side
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={() => setDarkMode((prev) => !prev)}
            />
          )}
        />
    </List.Section>
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

export default SettingsScreen;