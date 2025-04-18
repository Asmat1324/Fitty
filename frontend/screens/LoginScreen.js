import React, { useState, useContext, useMemo} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { AuthContext } from '../utilities/authContext';
import {useTheme} from '../utilities/ThemeContext'

export default function LoginScreen({ navigation, setIsAuthenticated }) {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {setUser, setToken } = useContext(AuthContext);
  const {theme} = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const handleInputChange = (name, value) => {
    setFormData({...formData, [name]: value});
  }
  const handleLogin = async (e) => {
      e.preventDefault();
      setErrorMessage("");

   try{
    const apiUrl = `${config.apiBaseUrl}/api/auth/login`; // imported variable from config.js
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    const responseData = await response.json(); // read once
    
    if (response.ok) {
      
      await AsyncStorage.setItem('token', responseData.token);
      setToken(responseData.token); // store token
      console.log("USER IS: " + response.user)
      setUser(responseData.user);
      setIsAuthenticated(true);
    } else {
      setErrorMessage(responseData.msg || "Invalid credentials.");
    }
   }catch(err){
    setErrorMessage("An error occured. Please try again.");
    console.error("Login error:", err);
   }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get <Text style={styles.highlight}>Fitty</Text></Text>
      <View style={styles.card}>
      <TextInput
          style={styles.input}
          placeholder="Email"
          name="email"
          placeholderTextColor={theme.text}
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        {errorMessage ? <Text style={styles.error}> {errorMessage}</Text> : null}
       {/*{errorMessage.includes('Email') || errorMessage.includes('Username') || errorMessage === "Invalid credentials." ? (
        <Text style={styles.error}> {errorMessage}</Text>
       ) : null}
        */}
         <TextInput
          style={styles.input}
          placeholder="Password"
          name="password"
          placeholderTextColor={theme.text}
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)} 
        />
        {/*{errorMessage.includes('Password') || errorMessage === "Invalid credentials." ? (
          <Text style={styles.error}>{errorMessage}</Text>
          ) : null} */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: theme.text,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  highlight: {
    color: '#48E0E4',
  },
 card: {
    width: '100%',
    backgroundColor: theme.background,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.text,
    alignItems: 'center',  
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: theme.buttonColor,
    color: theme.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  error: {
    color: '#FF4D4D',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.buttonColor,
    borderRadius: 20,
    padding: 12,
    width: '50%',  
    marginTop: 10,
    alignItems: 'center',  
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: theme.text,
    textAlign: 'center',
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
});
