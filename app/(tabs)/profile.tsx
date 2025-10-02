import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilePage() {
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

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Info Section */}
        <View
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 20,
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
          <Image
            source={require('../../assets/images/icon.png')}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 16,
            }}
            resizeMode="cover"
          />
          
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000',
              marginBottom: 4,
            }}
          >
            Albert Stevano
          </Text>
          
          <Text
            style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 16,
            }}
          >
            albert.stevano@email.com
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#000',
              borderRadius: 20,
              paddingHorizontal: 24,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
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
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: index < profileOptions.length - 1 ? 1 : 0,
                borderBottomColor: '#f0f0f0',
              }}
            >
              <Ionicons
                name={option.icon as any}
                size={22}
                color={option.color}
                style={{ marginRight: 16 }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: option.color,
                  fontWeight: option.title === 'Logout' ? '600' : '400',
                }}
              >
                {option.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#ccc"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}