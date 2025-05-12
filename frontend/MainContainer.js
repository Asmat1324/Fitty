import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from './utilities/ThemeContext'
// Screens

import HomeScreen from './screens/HomeScreen';
import ExerciseContainer from './screens/ExerciseContainer';
import TrackerContainer from './screens/TrackerContainer';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import NotificationScreen from './screens/NotificationScreen'
import { AuthContext } from './utilities/authContext';
import ChatScreen from './screens/ChatScreen';
// Screen Names
const homeName = 'Fitty Stream';
const trackerName = 'Diet';
const notificationName = 'Social';
const settingsName = 'Settings';
const workoutName = 'Exercise';
const chatName = 'Chat';
// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigator for main app
const MainTabs = () => {
  const {theme} = useTheme();
  return (
  <Tab.Navigator
    initialRouteName={homeName}
    screenOptions={({ route }) => ({
      headerShown:false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let rn = route.name;

        if (rn === homeName) {
          iconName = focused ? 'home' : 'home-outline';
        } else if (rn === trackerName) {
          iconName = focused ? 'leaf' : 'leaf-outline';
        } else if (rn === workoutName) {
          iconName = focused ? 'barbell' : 'barbell-outline';
        } else if (rn === notificationName) {
          iconName = focused ? 'notifications' : 'notifications-outline';
        } else if (rn === settingsName) {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.text + '88', // slightly faded
      tabBarStyle: {
        backgroundColor: theme.card,
        borderTopColor: theme.border,
        backgroundColor: theme.background,
        borderTopColor: 'transparent',
        backdropFilter: 'blur(10px)',
      },
      headerTintColor: theme.background,
     
    })}
  >
    <Tab.Screen name={homeName} component={HomeScreen} />
    <Tab.Screen name={workoutName} component={ExerciseContainer} />
    <Tab.Screen name={trackerName} component={TrackerContainer} />
    <Tab.Screen name={notificationName} component={NotificationScreen} />
    <Tab.Screen name={settingsName} component={SettingsScreen} />
  </Tab.Navigator>
)};

const MainContainer = () => {
  const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name={chatName} component={ChatScreen} />         
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;
