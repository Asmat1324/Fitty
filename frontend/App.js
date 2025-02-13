import React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import HomeScreen from './screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
