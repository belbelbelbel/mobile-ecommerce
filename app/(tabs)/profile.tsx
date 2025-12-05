import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { signOutUser } from '../../services/auth';
import { useRouter } from 'expo-router';
import { colors, layout, spacing, surfaces } from '@/styles/theme';
import { useToast } from '../../contexts/ToastContext';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Redirect to signin if not authenticated (using useEffect to avoid render-time navigation)
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/signin');
    }
  }, [authLoading, user, router]);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setLoading(true);
      await signOutUser();
      showToast('Signed out successfully.', 'success');
      router.replace('/signin');
    } catch (error: any) {
      console.error('Logout error:', error);
      showToast('Failed to logout. Please try again.', 'error');
    } finally {
      setLoading(false);
      setShowLogoutModal(false);
    }
  };

  const handleMenuPress = (title: string) => {
    switch (title) {
      case 'Edit Profile':
        showToast('Edit Profile feature will be available soon.', 'info');
        break;
      case 'Shipping Address':
        router.push('/shipping-address');
        break;
      case 'Payment Methods':
        showToast('Payment methods will be available soon.', 'info');
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
        showToast('Settings will be available soon.', 'info');
        break;
      case 'Admin Panel':
        router.push('/admin');
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
    { icon: 'cube-outline', title: 'Admin Panel', color: '#1976d2' },
    { icon: 'log-out-outline', title: 'Logout', color: '#ef4444' },
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

  // Show nothing while redirecting (redirect is handled in useEffect)
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={layout.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.screenPadding,
          paddingVertical: 16,
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
        contentContainerStyle={{ paddingBottom: spacing.sectionSpacing * 4 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info Section */}
        <View
          style={[
            surfaces.card,
            {
              marginHorizontal: spacing.screenPadding,
              marginTop: 10,
              marginBottom: spacing.sectionSpacing - 8,
              padding: 20,
              alignItems: 'center',
            },
          ]}
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
          style={[
            surfaces.card,
            {
              marginHorizontal: spacing.screenPadding,
              marginBottom: spacing.sectionSpacing - 8,
              overflow: 'hidden',
            },
          ]}
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
          style={[
            surfaces.card,
            {
              marginHorizontal: spacing.screenPadding,
              marginBottom: spacing.sectionSpacing - 8,
              overflow: 'hidden',
            },
          ]}
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
          
          {profileOptions.slice(4, 8).map((option, index) => (
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
                  {option.title === 'Notifications' && 'Push notification preferences'}
                  {option.title === 'Help & Support' && 'Get help with your orders'}
                  {option.title === 'Settings' && 'App preferences and privacy'}
                  {option.title === 'Admin Panel' && 'Manage products and inventory'}
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
          style={[
            surfaces.card,
            {
              marginHorizontal: spacing.screenPadding,
              marginBottom: spacing.sectionSpacing - 8,
              overflow: 'hidden',
            },
          ]}
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
                color="#ef4444"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#ef4444',
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
              <ActivityIndicator size="small" color="#ef4444" />
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
      <ConfirmationModal
        visible={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Stay Logged In"
        loading={loading}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  );
}