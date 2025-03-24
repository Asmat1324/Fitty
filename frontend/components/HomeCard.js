import React from 'react';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const HomeCard = () => {
  return (
    <Card style={{ marginBottom: 20 }}>
      <Card.Content>
        <Title>Welcome to Fitty</Title>
        <Paragraph>Your fitness journey starts here.</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => console.log('Pressed')}>Get Started</Button>
      </Card.Actions>  
    </Card>
  );
};

export default HomeCard;