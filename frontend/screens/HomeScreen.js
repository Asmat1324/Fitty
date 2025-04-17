import React, {useContext, useState} from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { AuthContext } from '../utilities/authContext';
import config from '../config';
import axios from 'axios';
import {useTheme} from '../utilities/ThemeContext';

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
  const {theme} = useTheme();
  const styles = getStyles(theme);
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

export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.text,
  },
username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.text,
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
    color: theme.text,
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
    color: theme.text,
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
   buttonText: {
    color: theme.text,
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
    color: theme.text
  },
})

export default HomeScreen;