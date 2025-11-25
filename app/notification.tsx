import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../contexts/ToastContext';
import { layout, spacing, surfaces, colors } from '@/styles/theme';

interface Notification {
  id: string;
  message: string;
  timestamp: number;
  type: 'cart' | 'order' | 'general';
}

const NotificationScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const { showToast } = useToast();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const value = await AsyncStorage.getItem('notify');
      if (value !== null) {
        const rawNotifications = JSON.parse(value);
        
        // Convert old string format to new object format
        const formattedNotifications: Notification[] = rawNotifications.map((item: any, index: number) => {
          if (typeof item === 'string') {
            return {
              id: `notification_${Date.now()}_${index}`,
              message: item,
              timestamp: Date.now() - (index * 1000), // Stagger timestamps
              type: item.includes('cart') ? 'cart' : item.includes('order') ? 'order' : 'general',
            };
          }
          return item;
        });

        // Sort by timestamp (newest first)
        formattedNotifications.sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  }, []);

  const handleRemoveNotification = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.filter(item => item.id !== notificationId);
      setNotifications(updatedNotifications);
      await AsyncStorage.setItem('notify', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  const handleClearAll = () => {
    setShowClearModal(true);
  };

  const confirmClearAll = async () => {
    try {
      setClearing(true);
      setNotifications([]);
      await AsyncStorage.removeItem('notify');
      showToast('All notifications cleared.', 'success');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      showToast('Failed to clear notifications.', 'error');
    } finally {
      setClearing(false);
      setShowClearModal(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'cart': return 'bag';
      case 'order': return 'receipt';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'cart': return '#3b82f6';
      case 'order': return '#10b981';
      default: return '#6c757d';
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View
      style={[
        surfaces.card,
        {
          padding: 16,
          marginHorizontal: spacing.screenPadding,
          marginBottom: 12,
          flexDirection: 'row',
          alignItems: 'flex-start',
        },
      ]}
    >
      {/* Notification Icon */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: `${getNotificationColor(item.type)}20`,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons 
          name={getNotificationIcon(item.type) as any} 
          size={24} 
          color={getNotificationColor(item.type)} 
        />
      </View>

      {/* Notification Content */}
      <View style={{ flex: 1, marginRight: 8 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#000',
            marginBottom: 4,
            lineHeight: 20,
          }}
        >
          {item.message}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#666',
          }}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        onPress={() => handleRemoveNotification(item.id)}
        style={{
          padding: 4,
        }}
      >
        <Ionicons name="close" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={layout.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.screenPadding,
          paddingVertical: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            Notifications
          </Text>
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            style={{
              backgroundColor: '#ef4444',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
            Loading notifications...
          </Text>
        </View>
      ) : notifications.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
          }}
        >
          <Ionicons name="notifications-outline" size={80} color="#ccc" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#666',
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            No notifications yet
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#999',
              marginTop: 8,
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            You'll see updates about your orders, favorites, and cart here
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: spacing.sectionSpacing * 4,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <ConfirmationModal
        visible={showClearModal}
        title="Clear All Notifications"
        message="This will remove every notification from your inbox."
        confirmText="Clear All"
        cancelText="Cancel"
        loading={clearing}
        onCancel={() => setShowClearModal(false)}
        onConfirm={confirmClearAll}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;
