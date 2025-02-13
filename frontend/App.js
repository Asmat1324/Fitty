import * as React from 'react';
import MainContainer from './MainContainer';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import HomeScreen from './screens/HomeScreen';

export default function App() {
  return (
    <MainContainer/>
  );
}
