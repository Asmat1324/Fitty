import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import {useTheme} from '../utilities/ThemeContext'


export default function WorkoutTrackerScreen() {
  const {theme} = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Text style={styles.title}>
        Workout <Text style={styles.highlight}>Tracker</Text>
      </Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Enter Workout"
        />
        <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonText}>Add Workout</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const getStyles =(theme)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: theme.text,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  highlight: {
    color: '#48E0E4',
  },
  card: {
    width: '90%',
    backgroundColor: theme.background,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.text,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    width: '100%',
    backgroundColor: theme.inputText,
    color: theme.text,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#48E0E4',
    borderRadius: 25,
    paddingVertical: 15,
    width: '75%',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodList: {
    marginTop: 20,
    width: '100%',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: theme.background,
  },
  foodName: {
    color: theme.text,
    fontSize: 16,
  },
  foodCalories: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '300',
  },
  totals: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#48E0E4',
    textAlign: 'center',
  },
});

