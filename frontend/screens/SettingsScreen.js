import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { List } from 'react-native-paper';
import { useTheme } from '../utilities/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme, mode } = useTheme();
  const darkMode = mode === 'dark';
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>

      <List.Section>
        <List.Item
          title="Account"
          description="Manage account settings"
          left={() => <List.Icon icon="account" color={theme.text} />}
          titleStyle={styles.itemText}
          descriptionStyle={styles.itemDescription}
          onPress={() => navigation.navigate('trackerScreen')}
        />
        <List.Item
          title="Notifications"
          description="Enable/disable notifications"
          left={() => <List.Icon icon="bell" color={theme.text} />}
          titleStyle={styles.itemText}
          descriptionStyle={styles.itemDescription}
          onPress={() => navigation.navigate('trackerScreen')}
        />
        <List.Item
          title="Privacy"
          description="Update your privacy preferences"
          left={() => <List.Icon icon="lock" color={theme.text} />}
          titleStyle={styles.itemText}
          descriptionStyle={styles.itemDescription}
          onPress={() => navigation.navigate('PrivacyScreen')}
        />
        <List.Item
          title="Dark Mode"
          left={() => <List.Icon icon="theme-light-dark" color={theme.text} />}
          titleStyle={styles.itemText}
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={toggleTheme}
            />
          )}
        />
      </List.Section>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
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
  itemText: {
    color: theme.text,
  },
  itemDescription: {
    color: theme.subtleText || '#999',
  },
});

export default SettingsScreen;
