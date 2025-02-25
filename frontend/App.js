import React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import MainContainer from './MainContainer';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <MainContainer />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
