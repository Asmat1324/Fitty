import React, { useState } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screens/HomeScreen';
import TrackerScreen from './screens/TrackerScreen';
import TrackerContainer from './screens/TrackerContainer';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import NotificationScreen from './screens/NotificationScreen'
// Screen Names
const homeName = 'Fitty Stream';
const trackerName = 'Tracker';
const notificationName = 'Notifications';
const settingsName = 'Settings';
const workoutName = 'Workouts';
// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigator for main app
const MainTabs = () => (
  <Tab.Navigator
    initialRouteName={homeName}
    screenOptions={({ route }) => ({
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
      },
    })}
  >
    <Tab.Screen name={homeName} component={HomeScreen} />
    <Tab.Screen name={workoutName} component={WorkoutScreen} />
    <Tab.Screen name={trackerName} component={TrackerContainer} />
    <Tab.Screen name={notificationName} component={NotificationScreen} />
    <Tab.Screen name={settingsName} component={SettingsScreen} />
  </Tab.Navigator>
);

const MainContainer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer options={{ headerShown: false }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="Signup">
              {props => <SignupScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
          
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;
