import React from 'react';
import { Card, Title } from 'react-native-paper'; 
import { Text, Image, View, StyleSheet } from 'react-native';

const ExerciseCard = ({ data }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{data.bodyPart}</Title>
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
  <Text key={index}>
    • {step}
  </Text>
))}

      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
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
    color: '#333',
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
    color: '#444',
    marginTop: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  paragraph: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
});

export default ExerciseCard;
