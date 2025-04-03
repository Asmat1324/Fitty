import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export default function LoginScreen({ navigation, setIsAuthenticated }) {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
/*
  const handleInputChange = (name, value) => {
    setFormData({...formData, [name]: value});
  }*/
  const handleLogin = async (e) => {
      e.preventDefault();
      setErrorMessage("");

   try{
    const apiUrl = `${config.apiBaseUrl}/api/auth/login`; // imported variable from config.js
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: loginIdentifier,
        email: loginIdentifier,
        password: password,
      }),
    });

    const responseData = await response.json();

    if(response.ok){
      await AsyncStorage.setItem('token', responseData.token);
      setIsAuthenticated(true);
    }
    else {
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
          placeholder="Email or username"
          //name="email"
          placeholderTextColor="#ccc"
          value={loginIdentifier}
          onChangeText={setLoginIdentifier} 
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
          placeholderTextColor="#CCC"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  highlight: {
    color: '#48E0E4',
  },
 card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',  
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#2E6F75',
    color: '#999',
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
    backgroundColor: '#2E6F75',
    borderRadius: 20,
    padding: 12,
    width: '50%',  
    marginTop: 10,
    alignItems: 'center',  
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
});
