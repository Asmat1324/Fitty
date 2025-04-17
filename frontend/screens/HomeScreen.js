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
      username: user?.username?.toLowerCase() || 'you',
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

    if (!result.canceled) {
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
      <View style={styles.header}>
        <Image source={{ uri: profileImage }} style={styles.profPicImage} />
        <Text style={styles.welcomeText}>
          Welcome, {user?.firstname} {user?.lastname}
        </Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity onPress={handleUpload} style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal for New Post */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Post</Text>

            <TouchableOpacity onPress={pickImage} style={styles.pickImageBtn}>
              <Text style={styles.pickImageText}>
                {selectedImage ? 'Change Image' : 'Choose Image'}
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

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      alignItems: 'center',
      paddingTop: 30,
      paddingBottom: 10,
    },
    profPicImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 2,
      borderColor: theme.text,
      backgroundColor: '#A999',
    },
    welcomeText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginTop: 10,
    },
    feed: {
      paddingHorizontal: 16,
      paddingBottom: 80,
    },
    card: {
      marginBottom: 16,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.text,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    username: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.text,
      marginBottom: 10,
    },
    image: {
      width: '100%',
      height: 250,
      borderRadius: 12,
    },
    caption: {
      marginTop: 10,
      fontSize: 15,
      color: theme.text,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
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
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 30,
      backgroundColor: '#48E0E4',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
    fabText: {
      fontSize: 32,
      color: '#fff',
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '85%',
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      fontSize: 16,
      color: '#333',
      marginTop: 10,
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      backgroundColor: '#48E0E4',
      borderRadius: 8,
      paddingVertical: 12,
      marginHorizontal: 5,
    },
    modalButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    pickImageBtn: {
      backgroundColor: '#eee',
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
      borderRadius: 12,
      marginTop: 10,
      marginBottom: 10,
    },
  });

export default HomeScreen;
