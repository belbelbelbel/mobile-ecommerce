import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { signOutUser } from '../../services/auth';
import { useRouter } from 'expo-router';

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await signOutUser();
              router.replace('/signin');
            } catch (error: any) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
              console.error('Logout error:', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleMenuPress = (title: string) => {
    switch (title) {
      case 'Edit Profile':
        Alert.alert('Coming Soon', 'Edit Profile feature will be available soon.');
        break;
      case 'Shipping Address':
        router.push('/shipping-address');
        break;
      case 'Payment Methods':
        Alert.alert('Coming Soon', 'Payment Methods management will be available soon.');
        break;
      case 'Order History':
        router.push('/order-history');
        break;
      case 'Notifications':
        router.push('/notification');
        break;
      case 'Help & Support':
        router.push('/help-support');
        break;
      case 'Settings':
        Alert.alert('Coming Soon', 'Settings will be available soon.');
        break;
      case 'Logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const profileOptions = [
    { icon: 'person-outline', title: 'Edit Profile', color: '#666' },
    { icon: 'location-outline', title: 'Shipping Address', color: '#666' },
    { icon: 'card-outline', title: 'Payment Methods', color: '#666' },
    { icon: 'time-outline', title: 'Order History', color: '#666' },
    { icon: 'notifications-outline', title: 'Notifications', color: '#666' },
    { icon: 'help-circle-outline', title: 'Help & Support', color: '#666' },
    { icon: 'settings-outline', title: 'Settings', color: '#666' },
    { icon: 'log-out-outline', title: 'Logout', color: '#ff4444' },
  ];

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Redirect to signin if not authenticated
  if (!user) {
    router.replace('/signin');
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: '#f8f9fa',
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
          }}
        >
          Profile
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info Section */}
        <View
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 20,
            marginTop: 10,
            marginBottom: 20,
            borderRadius: 16,
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* User Avatar */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#e0e0e0',
              marginBottom: 16,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {userProfile?.photoURL ? (
              <Image
                source={{ uri: userProfile.photoURL }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={50} color="#666" />
            )}
          </View>
          
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#000',
              marginBottom: 4,
              textAlign: 'center',
            }}
          >
            {userProfile?.displayName || user?.displayName || 'User'}
          </Text>
          
          <Text
            style={{
              fontSize: 16,
              color: '#666',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            {user?.email || 'No email available'}
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#000',
              borderRadius: 25,
              paddingHorizontal: 32,
              paddingVertical: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => handleMenuPress('Edit Profile')}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 20,
            marginBottom: 20,
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000',
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            Quick Actions
          </Text>
          
          {profileOptions.slice(0, 4).map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: index < 3 ? 1 : 0,
                borderBottomColor: '#f0f0f0',
                opacity: loading ? 0.6 : 1,
              }}
              onPress={() => handleMenuPress(option.title)}
              disabled={loading}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${option.color}20`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={option.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    fontWeight: '600',
                    marginBottom: 2,
                  }}
                >
                  {option.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#666',
                  }}
                >
                  {option.title === 'Order History' && 'View your past orders'}
                  {option.title === 'Shipping Address' && 'Manage delivery addresses'}
                  {option.title === 'Payment Methods' && 'Manage payment options'}
                  {option.title === 'Notifications' && 'View recent updates'}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#ccc"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings & Support */}
        <View
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 20,
            marginBottom: 20,
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000',
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            Settings & Support
          </Text>
          
          {profileOptions.slice(4, 7).map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: index < 2 ? 1 : 0,
                borderBottomColor: '#f0f0f0',
                opacity: loading ? 0.6 : 1,
              }}
              onPress={() => handleMenuPress(option.title)}
              disabled={loading}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${option.color}20`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={option.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    fontWeight: '600',
                    marginBottom: 2,
                  }}
                >
                  {option.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#666',
                  }}
                >
                  {option.title === 'Notifications' && 'Push notification preferences'}
                  {option.title === 'Help & Support' && 'Get help with your orders'}
                  {option.title === 'Settings' && 'App preferences and privacy'}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#ccc"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Section */}
        <View
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 20,
            marginBottom: 20,
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 16,
              opacity: loading ? 0.6 : 1,
            }}
            onPress={() => handleMenuPress('Logout')}
            disabled={loading}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#ffebee',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#ff4444"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#ff4444',
                  fontWeight: '600',
                  marginBottom: 2,
                }}
              >
                Logout
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#999',
                }}
              >
                Sign out of your account
              </Text>
            </View>
            {loading ? (
              <ActivityIndicator size="small" color="#ff4444" />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#ccc"
              />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}