import { Link } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
 import config from '../config';
import {useTheme} from '../utilities/ThemeContext'
//import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation}) {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const handleInputChange = (name, value) => {setFormData({...formData, [name]: value});}
 
  // SIGNUP HANDLING
  const handleSignup = async () => {
    setErrorMessage(""); 
  
    try {
      const form = new FormData();
      if (image) {
        form.append('profilePicture', {
          uri: image,
          type: 'image/jpeg',
          name: 'profilePic.jpg',
        });
      }
  
      form.append('firstname', formData.firstname);
      form.append('lastname', formData.lastname);
      form.append('username', formData.username);
      form.append('email', formData.email);
      form.append('password', formData.password);
  
      const apiUrl = `${config.apiBaseUrl}/api/auth/register`;
  
      const response = await fetch(apiUrl, {
        method: "POST",
        body: form,
        headers: {
          Accept: 'application/json',
        },
      });
  
      const rawText = await response.text();
  
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        console.error('Server returned non-JSON:', rawText);
        throw new Error(rawText); // this could be 'Server error' or full HTML
      }
  
      if (response.ok) {
        navigation.navigate('Login');
      } else {
        setErrorMessage(data.msg || "Registration failed.");
      }
  
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMessage(err.message || "An error occurred. Please try again.");
    }
  };
  



//If user chooses to take a photo using camera
const openCamera = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (permissionResult.granted === false) {
    alert("You've refused to allow this app to access your cam.");
    return;
  }
  let result = await ImagePicker.launchCameraAsync({
    //mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4,3],
    quality: 1,
  });
  if (!result.cancelled && result.assets && result.assets.length > 0) {
    setImage(result.assets[0].uri);
  }
};

  //If user chooses to use image from camera roll
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      //mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,

    });
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri)
    }};   
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get <Text style={styles.highlight}>Fitty</Text></Text>
      <Text style={styles.title}>But first... <Text style={styles.highlight}>Create an account!</Text></Text>
      <View style={styles.card}>
      <TextInput
          style={styles.input}
          placeholder="First Name"
          name="firstname"
          placeholderTextColor={theme.text}
          value={formData.firstname}
          onChangeText={(text) => handleInputChange('firstname', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          name="lastname"
          placeholderTextColor={theme.text}
          value={formData.lastname}
          onChangeText={(text) => handleInputChange('lastname', text)}
        />
      <TextInput
          style={styles.input}
          placeholder="Username"
          name="username"
          placeholderTextColor={theme.text}
          value={formData.username}
          onChangeText={(text) => handleInputChange('username', text)}
        />
        {errorMessage ? <Text style={styles.error}>Username is already in use. Please enter another one.</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email (Eg. Example@email.com)"
          name="email"
          placeholderTextColor={theme.text}
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        {errorMessage ? <Text style={styles.error}>The email you have entered is in use already.</Text> : null}
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          name="password"
          placeholderTextColor={theme.text}
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)} 
        />
        <View style={styles.profPicPad}>
        <Image source={{ uri: image }} style={styles.profPicImage} />
        </View>
        <View style={styles.profPic}>
          <TouchableOpacity  onPress={pickImage} ><Text style={styles.buttonText}>Select Photo</Text></TouchableOpacity>
          <TouchableOpacity  ><Text style={styles.buttonText}> | </Text></TouchableOpacity>
          <TouchableOpacity  onPress={openCamera}><Text style={styles.buttonText}>Take Photo</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.submitButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

       
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.accountAlready} >Already have an account? Tap here</Text>
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
    width: '70%',  
    marginTop: 10,
    alignItems: 'center',  
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '',
    alignItems: 'center',
  },
  submitButtonText: {
    color: theme.text,
    fontSize: 25,
    fontWeight: 700,
    alignItems: 'center',
  },
  forgotPassword: {
    color: theme.text,
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
  profPic: {
    backgroundColor: theme.buttonColor,
    borderRadius: 50,
    padding: 10,
    width: '58%',  
    marginTop: 0,
    flexDirection: 'row' ,
    alignItems: 'center',  
    justifyContent: 'center',
  },
  profPicText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  profPicImage: {
    width: 100, 
    height: 100,
    backgroundColor: '#A999',
    borderWidth: 2,
    borderColor: theme.text,
    borderRadius: 50,  
    marginTop: 10,
  },
  profPicPad: {
    backgroundColor: theme.buttonColor,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingTop: -2,
    paddingBottom: 10,
    width: '30%',  
    marginBottom: -10,
    alignItems: 'center',  
    justifyContent: 'center',
  },
});
