import { Link } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import config from '../config';
//import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation}) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "", 
    username: "",
    email: "",
    password: "" });
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleInputChange = (name, value) => {setFormData({...formData, [name]: value});}
  const handleSignup = async (e) => {
      e.preventDefault();
      setErrorMessage(""); 
   try{
    const formDataToSend = new FormData();
    formDataToSend.append('firstname', formData.firstname);
    formDataToSend.append('lastname', formData.lastname);
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    
    if (image) {
      const fileInfo = await FileSystem.getInfoAsync(image);
      if (fileInfo.exists) {
        const base64 = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });
        formDataToSend.append('profilePicture', {
          uri: image,
          name: image.split('/').pop(),
          type: 'image/' + image.split('.').pop(),
          data: base64,
        });
      }
    }

    const apiUrl = `${config.apiBaseUrl}/api/auth/register`; // imported variable from config.js
    const response = await fetch(apiUrl, {
    //const response = await fetch("http://192.168.1.161:19000/api/auth/register", {
      method: "POST",
      //headers: {"Content-Type": "application/json"},
      //body: JSON.stringify(formData),
      body: formDataToSend,
    });

    const responseData = await response.json();

    if(response.ok){
      //const data = await response.json();
      navigation.navigate('Login')
    }
    else {
     // const { errorMessage } = await response.json();
     // setErrorMessage(errorMessage || "Invalid credentials.");
     setErrorMessage(responseData.msg || "Registration failed.");
    }
   }
   catch(err){
    setErrorMessage("An error occured. Please try again.");
    console.error("Signup error:", err);
   }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
    setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
      base64: false,
    });

    //console.log(result.uri);
    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      console.log('Image URI:', result.assets[0].uri);
    }
    };   

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get <Text style={styles.highlight}>Fitty</Text></Text>
      <Text style={styles.title}>But first... <Text style={styles.highlight}>Create an account!</Text></Text>
      <View style={styles.card}>
      <TextInput
          style={styles.input}
          placeholder="First Name"
          name="firstname"
          placeholderTextColor="#CCC"
          value={formData.firstname}
          onChangeText={(text) => handleInputChange('firstname', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          name="lastname"
          placeholderTextColor="#CCC"
          value={formData.lastname}
          onChangeText={(text) => handleInputChange('lastname', text)}
        />
      <TextInput
          style={styles.input}
          placeholder="Username"
          name="username"
          placeholderTextColor="#CCC"
          value={formData.username}
          onChangeText={(text) => handleInputChange('username', text)}
        />
        {errorMessage.includes('Username') ? <Text style = {styles.error}>{errorMessage}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email (Eg. Example@email.com)"
          name="email"
          placeholderTextColor="#CCC"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        {errorMessage.includes('Email') ? <Text style = {styles.error}>{errorMessage}</Text> : null}
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          name="password"
          placeholderTextColor="#CCC"
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
      {errorMessage && !errorMessage.includes('Username') && !errorMessage.includes('Email') && ( 
        <Text style = {styles.error}>{errorMessage}</Text>
      )}
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
    backgroundColor: '#2E5F73',
    borderRadius: 20,
    padding: 12,
    width: '70%',  
    marginTop: 10,
    alignItems: 'center',  
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 700,
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
  profPic: {
    backgroundColor: '#2E6F75',
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
    borderColor: "#fff",
    borderRadius: 50,  
    marginTop: 10,
  },
  profPicPad: {
    backgroundColor: '#2E6F75',
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

