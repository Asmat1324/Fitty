import {React, useState} from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from './utilities/authContext';
import MainContainer from './MainContainer';
import { lightTheme, darkTheme } from './styles/theme';
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  return (
    <SafeAreaProvider>
      <PaperProvider theme={currentTheme}>
      <AuthProvider>
        <MainContainer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
