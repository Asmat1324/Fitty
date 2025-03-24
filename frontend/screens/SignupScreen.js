import { Link } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation, setIsAuthenticated }) {
  const [formData, setFormData] = useState({
     username: "",
     email: "",
     password: "" });
 // const [email, setEmail] = useState('');
 // const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleInputChange = (name, value) => {
    setFormData({...formData, [name]: value});
  }
  const handleSignup = async (e) => {
      e.preventDefault();
      setErrorMessage("");

   try{
    const response = await fetch("http://192.168.1.70:19000/api/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    });

    if(response.ok){
      const data = await response.json();
      //await AsyncStorage.setItem('token', data.token);
      navigation.navigate('Login')
    }
    else {
      const { errorMessage } = await response.json();
      setErrorMessage(errorMessage || "Invalid credentials.");
    }
   }
   catch(err){
    setErrorMessage("An error occured. Please try again.");
   }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get <Text style={styles.highlight}>Fitty</Text></Text>
      <Text style={styles.title}>But first... <Text style={styles.highlight}>Create an account!</Text></Text>
      <View style={styles.card}>
      <TextInput
          style={styles.input}
          placeholder="Username"
          name="username"
          placeholderTextColor="#CCC"
          value={formData.username}
          onChangeText={(text) => handleInputChange('username', text)}
        />
        {errorMessage ? <Text style={styles.error}>Username is already in use. Please enter another one.</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email (Eg. Example@email.com)"
          name="email"
          placeholderTextColor="#CCC"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        {errorMessage ? <Text style={styles.error}>The email you have entered is in use already.</Text> : null}
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          name="password"
          placeholderTextColor="#CCC"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)} 
        />


        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

       
        <Text style={styles.accountAlready} >Already have an account?</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}   >LOG IN</Text>
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
    alignItems: 'center',
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  accountAlready: {
    color: '#2E7F9E',
    textAlign: 'center',
    marginTop: 10,
    alignItems: 'center',
  },
});
