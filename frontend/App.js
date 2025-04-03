import React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import MainContainer from './MainContainer';
import { AuthProvider } from './utilities/authContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
        <MainContainer />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
