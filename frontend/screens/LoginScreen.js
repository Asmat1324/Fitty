import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('Invalid email or password.');
    } else {
      setErrorMessage('');
      setIsAuthenticated(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get <Text style={styles.highlight}>Fitty</Text></Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
        />
        {errorMessage ? <Text style={styles.error}>Username/email invalid. Please try again.</Text> : null}
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errorMessage ? <Text style={styles.error}>Password invalid. Please try again.</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
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
  },
  input: {
    backgroundColor: '#2E6F75',
    color: '#fff',
    borderRadius: 20,
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
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
