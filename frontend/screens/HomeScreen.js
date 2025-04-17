import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Card, Paragraph } from 'react-native-paper';
import { AuthContext } from '../utilities/authContext';
import config from '../config';
import axios from 'axios';
import { useTheme } from '../utilities/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { user } = useContext(AuthContext);

  const [profileImage, setProfileImage] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: '1',
      username: 'john_doe',
      imageUri: require('../assets/images/yummy.jpg'),
      caption: 'Cheat meal!!',
      likes: 120,
      comments: 5,
      liked: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (user?.profilePicture) {
      axios
        .get(`${config.apiBaseUrl}/api/auth/profile-picture/${user.profilePicture}`)
        .then((res) => setProfileImage(res.data.url))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleUpload = () => setModalVisible(true);

  const handlePostSubmit = () => {
    if (!selectedImage) return alert('Please choose an image.');

    const newPost = {
      id: Date.now().toString(),
      username: user?.firstname?.toLowerCase() || 'you',
      imageUri: { uri: selectedImage },
      caption: newCaption,
      likes: 0,
      comments: 0,
      liked: false,
    };

    setPosts([newPost, ...posts]);
    setNewCaption('');
    setSelectedImage(null);
    setModalVisible(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const renderPost = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.username}>{item.username}</Text>
        <Image source={item.imageUri} style={styles.image} />
        <Paragraph style={styles.caption}>{item.caption}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeBtn}>
          <FontAwesome
            name={item.liked ? 'heart' : 'heart-o'}
            size={20}
            color={item.liked ? '#ff5a5f' : '#888'}
          />
          <Text style={styles.likes}>{item.likes}</Text>
        </TouchableOpacity>
        <Text style={styles.comments}>{item.comments} Comments</Text>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: profileImage }} style={styles.profPicImage} />
      <Text style={styles.buttonText}>
        Welcome, <Text>{user?.firstname}</Text> <Text>{user?.lastname}</Text>
      </Text>

      <TouchableOpacity onPress={handleUpload} style={styles.plusButton}>
        <Text style={styles.plusText}> + </Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Post</Text>

            <TouchableOpacity onPress={pickImage} style={styles.pickImageBtn}>
              <Text style={styles.pickImageText}>
                {selectedImage ? 'Change Image' : 'Pick an Image'}
              </Text>
            </TouchableOpacity>

            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}

            <TextInput
              style={styles.input}
              placeholder="Write a caption..."
              placeholderTextColor="#888"
              value={newCaption}
              onChangeText={setNewCaption}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handlePostSubmit} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedImage(null);
                  setNewCaption('');
                }}
                style={[styles.modalButton, { backgroundColor: '#999' }]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 50,
      
      paddingHorizontal: 16,
    },
    profPicImage: {
      width: 70,
      height: 70,
      backgroundColor: '#A999',
      borderWidth: 2,
      alignSelf: 'center',
      borderColor: theme.text,
      borderRadius: 35,
      marginBottom: 10,
    },
    buttonText: {
      color: theme.text,
      alignSelf: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    plusButton: {
      backgroundColor: '#48E0E4',
      borderRadius: 30,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: 20,
      bottom: 30,
      zIndex: 10,
      elevation: 5,
    },
    plusText: {
      fontSize: 28,
      color: '#fff',
    },
    feed: {
      paddingBottom: 100,
    },
    card: {
      alignSelf: 'center',
      marginBottom: 20,
      borderRadius: 16,
      width: '90%',
      backgroundColor: theme.card || '#fff',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    username: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.text,
      marginBottom: 6,
    },
    image: {
      width: '100%',
      height: 300,
      borderRadius: 10,
      marginTop: 10,
    },
    caption: {
      marginTop: 10,
      fontSize: 14,
      color: theme.text,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderTopWidth: 1,
      borderColor: '#eee',
    },
    likeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    likes: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
    },
    comments: {
      fontSize: 14,
      color: theme.text,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginTop: 10,
      marginBottom: 20,
      fontSize: 16,
      color: '#333',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    modalButton: {
      flex: 1,
      backgroundColor: '#48E0E4',
      borderRadius: 8,
      paddingVertical: 10,
      marginHorizontal: 5,
    },
    modalButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    pickImageBtn: {
      backgroundColor: '#ddd',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    pickImageText: {
      fontWeight: 'bold',
      color: '#444',
    },
    previewImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 10,
    },
  });

export default HomeScreen;
