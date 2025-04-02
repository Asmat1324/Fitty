
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#48E0E4', 
    background: '#FFFFFF',
    text: '#333333',
    error: '#FF4D4D',
  }
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#48E0E4',
    background: '#333333',
    text: '#ffffff',
    error: '#FF4D4D',
  },
};