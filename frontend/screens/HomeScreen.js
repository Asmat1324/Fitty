import React from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';

const mockPosts = [
  {
    id: '1',
    username: 'john_doe',
    imageUri: require('../assets/images/yummy.jpg'),
    caption: 'Cheat meal!!',
    likes: 120,
    comments: 5,
  },
  {
    id: '2',
    username: 'fit_girl123',
    imageUri: require('../assets/images/working.jpg'),
    caption: 'My favorite post-workout smoothie! #healthy',
    likes: 200,
    comments: 10,
  },
  {
    id: '3',
    username: 'muscleman85',
    imageUri: require('../assets/images/yummy.jpg'),
    caption: 'Progress is the key! #gymmotivation',
    likes: 350,
    comments: 15,
  },
];

const HomeScreen = () => {
  const renderPost = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.username}>{item.username}</Text>
        <Image source={item.imageUri} style={styles.image} />
        <Paragraph style={styles.caption}>{item.caption}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Text style={styles.likes}>{item.likes} Likes</Text>
        <Text style={styles.comments}>{item.comments} Comments</Text>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  feed: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#fff',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  caption: {
    marginTop: 10,
    fontSize: 14,
    color: '#ddd',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  likes: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#48E0E4',
  },
  comments: {
    fontSize: 14,
    color: '#888',
  },
});

export default HomeScreen;