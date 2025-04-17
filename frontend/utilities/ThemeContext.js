import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';   
import { lightTheme, darkTheme } from '../styles/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [mode, setMode] = useState('light');

    useEffect(()=> {
        const loadTheme = async () => {
            
            const storedMode = await AsyncStorage.getItem('themeMode');
            if(storedMode === 'dark' || storedMode === 'light'){
                setMode(storedMode);
            }
        };
    loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newMode= mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        await AsyncStorage.setItem('themeItem', newMode);
    };

    const theme = mode === 'dark' ? darkTheme : lightTheme;

    return(
        <ThemeContext.Provider value={{ theme, mode, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);