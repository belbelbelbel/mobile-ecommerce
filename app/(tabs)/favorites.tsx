import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesPage() {
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
          Favorites
        </Text>
      </View>

      {/* Empty Favorites State */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
        }}
      >
        <Ionicons name="heart-outline" size={80} color="#ccc" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#666',
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          No favorites yet
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
          Tap the heart icon on items you love to save them here
        </Text>
      </View>
    </SafeAreaView>
  );
}