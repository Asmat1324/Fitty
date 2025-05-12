import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../utilities/ThemeContext';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatScreen = ({navigation}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const route = useRoute();
  const { conversationId, conversationName } = route.params;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    const initialize = async () => {
      const token = await AsyncStorage.getItem('token');
      setUserToken(token);
      fetchMessages(token);
    };
    initialize();
  }, []);

  const fetchMessages = async (token) => {
    try {
      const res = await axios.get(`${config.apiBaseUrl}/api/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.reverse()); // chronological order
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(`${config.apiBaseUrl}/api/conversations/${conversationId}/messages`,
        { content: input },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.header}>{conversationName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageSender}>{item.sender.firstname}</Text>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Social' })}
 style={styles.plusButton}>
                <Text style={styles.plusText}> 
                     <Icon name={'arrow-back'} size={20} color={theme.text} />
                </Text>
              </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    color: theme.text,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  plusButton: {
    backgroundColor: '#48E0E4',
    borderRadius: 30,
    width: 90,
    height: 29,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 50,
    top: -900,
    zIndex: 1,
    elevation: 5,
  },
  plusText: {
    fontSize: 28,
    color: '#fff',
  },
  messageBubble: {
    marginVertical: 8,
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 10,
  },
  messageSender: {
    fontWeight: 'bold',
    marginBottom: 3,
    color: theme.primary,
  },
  messageText: {
    color: theme.text,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: theme.card,
  },
  input: {
    flex: 1,
    backgroundColor: theme.inputText,
    color: theme.text,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: theme.buttonColor,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
