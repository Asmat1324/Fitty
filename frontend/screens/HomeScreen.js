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
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Card, Paragraph } from 'react-native-paper';
import { AuthContext } from '../utilities/authContext';
import config from '../config';
import axios from 'axios';
import { useTheme } from '../utilities/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { user, token } = useContext(AuthContext);

  const [profileImage, setProfileImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInputVisible, setCommentInputVisible] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  //set up axios headers with the token
  const setAuthToken = token => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        //load token from storage and set in axios headers
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setAuthToken(token);
        }

        //load profile picture if available
        if (user?.profilePicture) {
          try {
            const res = await axios.get(`${config.apiBaseUrl}/api/auth/profile-picture/${user.profilePicture}`);
              setProfileImage(res.data.url);
          } catch (err) {
            console.error("Failed to load profile picture:", err);
          }
        }

        //load posts
        fetchPosts();
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    loadUserData();
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.apiBaseUrl}/api/posts`);
      const formattedPosts = await Promise.all(res.data.map(async post => {
        let imageUrl = '';

        //Get signed URL for the image
        try {
          const imgRes = await axios.get(`${config.apiBaseUrl}/api/auth/profile-picture/${post.imageUri}`);
          imageUrl = imgRes.data.url;
        } catch (err) {
          console.error("Error getting image URL:", err);
        }

        const isLikedByUser = post.likes.some(like => like.user === user?._id);

        const formattedPost = {
          id: post._id,
          username: post.userID.username || post.userID.firstname?.toLowerCase() || 'unknown',
          imageUri: {uri: imageUrl},
          caption: post.caption,
          likes: post.likes.length,
          comments: post.comments ? post.comments.length : 0,
          liked: isLikedByUser,
          userId: post.userID._id
        };
        return formattedPost;
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.error("failed to fetch posts:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to load posts. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => setModalVisible(true);

  const handlePostSubmit = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    setUploading(true);

    try {
      //create from data fro the image upload
      const formData = new FormData();
      const imageName = selectedImage.split('/').pop();
      const imageType = imageName.endsWith('.jpg') ? 'image/jpeg' : 'image/png';

      formData.append('image', {
        uri: selectedImage,
        name: imageName,
        type: imageType,
      });

      formData.append('caption', newCaption);

      //Send the post request
      const res = await axios.post(
        `${config.apiBaseUrl}/api/posts`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      //Refresh the posts
      fetchPosts();

      //Clear form and close modal
      setNewCaption('');
      setSelectedImage(null);
      setModalVisible(false);

      Alert.alert("Success", "Your post has been uploaded!");
    } catch (err) {
      console.error("Error uploading post:", err);
      Alert.alert("Error", "Failed to upload post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    try{
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Permission to access gallery is required!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      //check
      if (!result.canceled) {
        if (result.assets && result.assets.length > 0){
          setSelectedImage(result.assets[0].uri);
        } 
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleLike = async (postId) => {
    try { 
      await axios.put(`${config.apiBaseUrl}/api/posts/like/${postId}`);

      //Update the local state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }
              :post
            )
          );
        } catch (err) {
          console.error("Error liking/unliking post:", err);
          Alert.alert("Error", "Failed to update like status. Please try again.");
        }
      };

      const openComments = async (postId) => {
        console.log("Post ID clicked:", postId);
        setSelectedPostId(postId);
        console.log("isCommentsVisible before:", isCommentsVisible);
        setIsCommentsVisible(true);
        console.log("isCommentsVisible after:", isCommentsVisible);
        setComments([]);
        setCommentInputVisible(true);
        try {
          const res = await axios.get(`${config.apiBaseUrl}/api/posts/comments/${postId}`);
          setComments(res.data);
          console.log("Comments data received:", res.data);
        } catch (err) {
          console.error("Error fetching comments:", err);
          Alert.alert("Error", "Failed to load comments. Please try again.");
        }
      };

      const closeComments = () => {
        setIsCommentsVisible(false);
        setSelectedPostId(null);
        setComments([]);
        setCommentInputVisible(false);
        setNewCommentText('');
      };

      const handlePostComment = async () => {
        if (!newCommentText.trim()) {
          return;
        }
        try {
          await axios.post(`${config.apiBaseUrl}/api/posts/comment/${selectedPostId}`, {
            text: newCommentText,
          });
          setNewCommentText('');
          setCommentInputVisible(false);
          // Refresh comments
          openComments(selectedPostId);
          Alert.alert("Success", "Comment posted successfully!");
          //console.log(post.comments);
        } catch (err) {
          console.error("Error posting comment:", err);
          Alert.alert("Error", "Failed to post comment.");
        }
      };

      const handleDeleteComment = async (commentId) => {
        Alert.alert(
          "Delete Comment",
          "Are you sure you want to delete this comment? This action cannot be undone.",
          [
            {text: "Cancel", style: "cancel"},
            {text: "Delete", style: "destructive",
              onPress: async () => {
                try {
                  console.log('Deleting comment with:', selectedPostId, commentId);
                  await axios.delete(`${config.apiBaseUrl}/api/posts/comment/${selectedPostId}/${commentId}`);
                  //refresh comments
                  openComments(selectedPostId);
                  Alert.alert("Deleted", "Comment has been deleted.");
                } catch (err) {
                  console.error("Error deleting comment:", err);
                  Alert.alert("Error", "Failed to delete comment. Please try again.");
                }
              }
            }
          ]
        );
      };

      const handleDeletePost = async (postId) => {
        Alert.alert(
          "Delete Post",
          "Are you sure you want to delete this post? This action cannot be undone.",
          [
            {text: "Cancel", style: "cancel"},
            {text: "Delete", style: "destructive",
              onPress: async () => {
                try {
                  await axios.delete(`${config.apiBaseUrl}/api/posts/${postId}`);
                  setPosts(prevPosts => prevPosts.filter(post => post.id != postId));
                  Alert.alert("Deleted", "Post has been deleted successfully.");
                } catch (err) {
                  console.error("Error deleting post:", err);
                  Alert.alert("Error", "Failed to delete post. Please try again.");
                }
              }
            }
          ]
        );
      };

      const renderCommentItem = ({ item }) => {
        return (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.user?.username || 'Unknown'}:</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            {item.date && <Text style={styles.commentTime}>{new Date(item.date).toLocaleTimeString()} - {new Date(item.date).toLocaleDateString()}</Text>}

            {item.user?._id === user?._id && (
              <TouchableOpacity onPress={() => handleDeleteComment(item._id)} style={styles.deleteCommentButton}>
                <FontAwesome name="trash" size={16} color="red" />
              </TouchableOpacity>
            )}
          </View>
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
        <TouchableOpacity onPress={() => openComments(item.id)} style={styles.commentBtn}>
          <Text style={styles.comments}>{item.comments} Comments</Text>
        </TouchableOpacity>
        {item.userId === user?._id && (
          <TouchableOpacity onPress={() => handleDeletePost(item.id)} style={styles.deleteBtn}>
            <FontAwesome name="trash" size={20} color="#e74c3c" />
          </TouchableOpacity>
        )}
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.constainer, styles.centered]}>
        <ActivityIndicator size ="large" color = "#48E0E4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: profileImage }} style={styles.profPicImage} />
      <Text style={styles.buttonText}>
        Welcome, <Text>{user?.firstname}</Text> <Text>{user?.lastname}</Text>
      </Text>

      <TouchableOpacity onPress={handleUpload} style={styles.plusButton}>
        <Text style={styles.plusText}> + </Text>
      </TouchableOpacity>

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>
          </View>
      ) : (
        <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
        refreshing={loading}
        onRefresh={fetchPosts}
      />
      )}

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
              placeholderTextColor={theme.text}
              value={newCaption}
              onChangeText={setNewCaption}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
              onPress={handlePostSubmit} 
              style={[styles.modalButton,
                uploading && {backgroundColor: '#ccc'}
              ]}
              disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Post</Text>
                )}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentsVisible}
        onRequestClose={closeComments}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.commentsModal}>
            <Text style={styles.modalTitle}>Comments</Text>
            
            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>No comments yet</Text>
            ) : (
              <FlatList
                data={comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCommentItem}
                style={styles.commentsList}
              />
            )}

            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={newCommentText}
              onChangeText={setNewCommentText}
              />
              <TouchableOpacity style={styles.postCommentButton} onPress={handlePostComment}>
                <Text style={styles.postCommentText}>PostComment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.closeButton} onPress={closeComments}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
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
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      color: theme.text,
      fontSize: 16,
      textAlign: 'center',
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
      padding: 10,
    },
 modalContent: {
      width: '90%',
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
    },
    modalTitle: {
      fontSize: 0.048 * width,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.text,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      elevation: 5,
    },
    modalButton: {
      flex: 1,
      backgroundColor: theme.buttonColor,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.text,
      paddingVertical: 10,
      marginHorizontal: 5,
    },
    modalButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginTop: 10,
      marginBottom: 20,
      fontSize: 16,
      color: theme.text,
  
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    pickImageBtn: {
      backgroundColor: theme.background,
      padding: 10,
      borderRadius: 8,
      elevation: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    pickImageText: {
      fontWeight: 'bold',
      color: theme.text,
    },
    previewImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    commentsModal: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: theme.card,
      borderRadius: 10,
      padding: 15,
    },
    modalTitle:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    noCommentsText: {
      fontStyle: 'italic',
      textAlign: 'center',
      marginVertical: 10,
    },
    commentsList: {
      maxHeight: 200,
      marginBottom: 10,
    },
    commentInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginTop: 10,
    },
    postCommentButton: {
      backgroundColor: '#48E0E4',
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    postCommentText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    closeButton: {
      alignItems: 'center',
      marginTop: 10,
    },
    closeButtonText: {
      color: '#888',
    },
    commentUser: {
      fontWeight: 'bold',
    },
    commentTime: {
      fontSize: 10,
      color: '#666',
      marginLeft: 4,
    },
    deleteBtn: {
      marginLeft: 16,
    },
    deleteCommentButton: {
      position: 'absolute',
      top: 5,
      right: 10,
    },
  });

export default HomeScreen;
