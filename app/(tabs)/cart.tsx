import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CartPage() {
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
          Shopping Cart
        </Text>
      </View>

      {/* Empty Cart State */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
        }}
      >
        <Ionicons name="bag-outline" size={80} color="#ccc" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#666',
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          Your cart is empty
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
          Add some items to your cart to see them here
        </Text>
      </View>
    </SafeAreaView>
  );
}