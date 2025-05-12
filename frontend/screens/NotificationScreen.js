import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform
} from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import { useTheme } from '../utilities/ThemeContext';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../utilities/authContext';

const { width } = Dimensions.get('window');

const NotificationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const { token, user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [userToken, setUserToken] = useState(token);
  const [currentUser, setCurrentUser] = useState(typeof user === 'string' ? JSON.parse(user) : user);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      if (userToken && currentUser) {
        await fetchAllUsers(userToken);
        await fetchConversations(userToken);
      } else {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const fetchConversations = async (token) => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.apiBaseUrl}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err.response?.data || err.message);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async (token) => {
    try {
      const res = await axios.get(`${config.apiBaseUrl}/api/conversations/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const createConversation = async () => {
    try {
      const usernames = inputText.split(',').map(u => u.trim());
      const matchedUsers = allUsers.filter(u => usernames.includes(u.username));
      const participantIds = matchedUsers.map(u => u._id.toString());

      if (!participantIds.includes(currentUser._id)) {
        participantIds.push(currentUser._id);
      }

      if (participantIds.length < 2) {
        alert('Please enter at least one valid username.');
        return;
      }

      const type = participantIds.length === 2 ? 'direct' : 'group';
      const payload = {
        participants: participantIds,
        type,
        name: type === 'group' ? `Group: ${usernames.join(', ')}` : null,
      };

      await axios.post(`${config.apiBaseUrl}/api/conversations`, payload, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setInputText('');
      setModalVisible(false);
      fetchConversations(userToken);
    } catch (err) {
      const raw = err?.response?.data;
      const contentType = err?.response?.headers?.['content-type'];

      if (typeof raw === 'string' && (!contentType || !contentType.includes('application/json'))) {
        console.error('Conversation error (string):', raw);
      } else {
        console.error('Conversation error (json):', raw || err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social</Text>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.newConvoButton}>
        <Text style={styles.newConvoText}>+ Start Chat</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Start a New Conversation</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter usernames (comma-separated)"
              placeholderTextColor="#888"
              value={inputText}
              onChangeText={setInputText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={createConversation} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#888' }]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {loading ? (
        <ActivityIndicator size={40} color={theme.primary} />
      ) : conversations.length === 0 ? (
        <Text style={{ color: theme.secondaryText, textAlign: 'center', marginTop: 20 }}>No conversations found.</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          renderItem={({ item }) => {
            const title = item.name || (item.participants?.map(p => p.firstname).join(', ') || 'Unnamed');
            const subtitle = item.lastMessage?.content || 'No messages yet';

            return (
              <TouchableOpacity
                style={styles.notificationItem}
                onPress={() => navigation.navigate('Chat', {
                  conversationId: item._id,
                  conversationName: title,
                })}
              >
                <View style={styles.avatarContainer}>
                  <Avatar.Text size={40} label={title.charAt(0) || 'C'} />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationName}>{title}</Text>
                  <Text style={styles.notificationMessage}>{subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: theme.text,
    textAlign: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.secondaryText,
  },
  divider: {
    backgroundColor: theme.border,
  },
  input: {
    width: '100%',
    backgroundColor: theme.inputText,
    color: theme.text,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  newConvoButton: {
    backgroundColor: theme.primary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginVertical: 10,
  },
  newConvoText: {
    fontSize: 18,
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
    width: '90%',
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.text,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    backgroundColor: theme.buttonColor,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NotificationScreen;