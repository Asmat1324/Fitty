import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Badge, Divider } from 'react-native-paper';
import { useTheme } from '../utilities/ThemeContext';

const sampleNotifications = [
  { id: '1', name: 'John Doe', message: 'Liked your workout.', unread: true },
  { id: '2', name: 'Jane Smith', message: 'Commented: Nice progress!', unread: false },
  { id: '3', name: 'Mike Johnson', message: 'Started following you.', unread: true },
  { id: '4', name: 'Emily Davis', message: 'Sent you a message.', unread: false },
];

const NotificationScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={sampleNotifications}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.notificationItem}>
            <View style={styles.avatarContainer}>
              <Avatar.Text size={40} label={item.name.charAt(0)} />
              {item.unread && <Badge style={styles.badge} size={10} />}
            </View>
            <View style={styles.notificationContent}>
              <Text style={[styles.notificationName, item.unread && styles.unread]}>{item.name}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.text,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
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
  unread: {
    color: theme.primary,
  },
  divider: {
    backgroundColor: theme.border,
  },
});

export default NotificationScreen;
