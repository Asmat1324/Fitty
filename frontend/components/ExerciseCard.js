import React from 'react';
import { Card, Title } from 'react-native-paper'; 
import { Text, Image, View, StyleSheet } from 'react-native';
import {useTheme} from '../utilities/ThemeContext';

 
function capitalizeFirstLetter(string) {
  if (!string) return string; // handle undefined or null input
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ExerciseCard = ({ data }) => {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  return (
    <Card style={styles.card}>
      <Card.Content>
        {console.log("Body Part:", data.bodyPart)}
        <Title style={styles.title}>{capitalizeFirstLetter(data.bodyPart)}</Title>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: data.gifUrl }}  
            style={styles.image} 
            resizeMode="cover"
          />
        </View>
        <Text style={styles.label}>
          Equipment: <Text style={styles.value}>{data.equipment}</Text>
        </Text>
        <Text style={styles.label}>
          Muscles Targeted: <Text style={styles.value}>{data.target}</Text>
        </Text>
        <Text style={styles.label}>
          Secondary Muscles: <Text style={styles.value}>{data.secondaryMuscles?.join(', ')}</Text>
        </Text>
        <Text style={styles.paragraph}>Instructions:</Text>
        {data.instructions?.map((step, index) => (
        <Text key={index} style={styles.paragraph}>
         • {step}
        </Text>
        ))}  

      </Card.Content>
    </Card>
  );
};

const getStyles = (theme) => StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    borderColor: theme.text,
    borderWidth: 1,
    backgroundColor: theme.background,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: theme.text,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: 'normal',
    color: theme.text,
  },
  paragraph: {
    marginTop: 10,
    fontSize: 14,
    color: theme.text,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: theme.text,
    marginLeft: 10,
  },
});

export default ExerciseCard;
