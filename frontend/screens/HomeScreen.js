import React, {useContext, useState} from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { AuthContext } from '../utilities/authContext';
import config from '../config';
import axios from 'axios';
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

const handleUpload = async (e) => {

}
const HomeScreen = () => {
  const { user } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const apiUrl = `${config.apiBaseUrl}`
  axios.get(`${config.apiBaseUrl}/api/auth/profile-picture/${user.profilePicture}`).then(res => {
    setProfileImage(res.data.url);
  });
  if (user) {
   console.log(`http://localhost:19000/uploads/${user.profilePicture}`);
  }

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
       <Image source={{ uri: profileImage }} style={styles.profPicImage} />
        <Text style={styles.buttonText}>Welcome, <Text>{user.firstname}</Text> <Text>{user.lastname}</Text></Text>
        <TouchableOpacity onPress={handleUpload} style={styles.plusButton}><Text style={styles.plusText}> + </Text></TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
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
  profPicImage: {
    width: 100, 
    height: 100,
    backgroundColor: '#A999',
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 50,  
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    backgroundColor: '#AAA',
    borderRadius: 30,
    padding: 5,
    position: 'absolute',
    paddingTop: -5,
    right: 10,
    top: 100
  },
  plusText: {
    fontSize: 24,
    color: '#fff'
  },
});

export default HomeScreen;