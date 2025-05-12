import React, { useMemo, useContext } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../utilities/ThemeContext';
import { AuthContext } from '../utilities/authContext';

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme, mode } = useTheme();
  const { setToken, setUser, setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  const darkMode = mode === 'dark';
  const styles = useMemo(() => getStyles(theme), [theme]);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);  // Clear token in context
      setUser(null);   // Clear user in context
      setIsAuthenticated(false);
      console.log(isAuthenticated)
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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
        {/* <List.Item
          title="Notifications"
          description="Enable/disable notifications"
          left={() => <List.Icon icon="bell" color={theme.text} />}
          titleStyle={styles.itemText}
          descriptionStyle={styles.itemDescription}
          onPress={() => navigation.navigate('trackerScreen')}
        /> */}
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
        <List.Item
          title="Logout"
          description="Log out of your account"
          left={() => <List.Icon icon="logout" color={theme.text} />}
          titleStyle={styles.itemText}
          descriptionStyle={styles.itemDescription}
          onPress={handleLogout}
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
