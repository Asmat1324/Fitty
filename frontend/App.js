import React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import MainContainer from './MainContainer';
import { AuthProvider } from './utilities/authContext';
import { ThemeProvider } from './utilities/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
        <MainContainer />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
    </ThemeProvider>
  );
}
