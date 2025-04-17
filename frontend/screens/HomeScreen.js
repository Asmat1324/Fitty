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
      right: 10,
      top: 100,
    },
    plusText: {
      fontSize: 24,
      color: theme.text,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
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