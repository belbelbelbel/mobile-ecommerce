import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { layout, spacing, surfaces, colors } from '@/styles/theme';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled';
  total: number;
  items: OrderItem[];
}

const OrderHistoryScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll create some sample orders
      // In a real app, you would fetch from your backend
      const sampleOrders: Order[] = [
        {
          id: 'ORD001',
          date: '2024-01-15',
          status: 'delivered',
          total: 299.99,
          items: [
            {
              id: '1',
              name: 'iPhone 14 Pro',
              price: 299.99,
              quantity: 1,
              imageUrl: 'https://example.com/iphone.jpg'
            }
          ]
        },
        {
          id: 'ORD002',
          date: '2024-01-10',
          status: 'shipped',
          total: 159.99,
          items: [
            {
              id: '2',
              name: 'AirPods Pro',
              price: 159.99,
              quantity: 1,
              imageUrl: 'https://example.com/airpods.jpg'
            }
          ]
        },
        {
          id: 'ORD003',
          date: '2024-01-05',
          status: 'processing',
          total: 89.99,
          items: [
            {
              id: '3',
              name: 'Phone Case',
              price: 89.99,
              quantity: 1,
              imageUrl: 'https://example.com/case.jpg'
            }
          ]
        }
      ];

      setOrders(sampleOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#3b82f6';
      case 'processing': return '#f59e0b';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return 'checkmark-circle';
      case 'shipped': return 'car';
      case 'processing': return 'time';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderOrderItem = (order: Order) => (
    <TouchableOpacity
      key={order.id}
      style={[
        surfaces.card,
        {
          padding: 16,
          marginHorizontal: spacing.screenPadding,
          marginBottom: spacing.sectionSpacing - 8,
        },
      ]}
    >
      {/* Order Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
            Order #{order.id}
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
            {formatDate(order.date)}
          </Text>
        </View>
        
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: `${getStatusColor(order.status)}20`,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Ionicons
            name={getStatusIcon(order.status) as any}
            size={16}
            color={getStatusColor(order.status)}
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: getStatusColor(order.status),
              textTransform: 'capitalize',
            }}
          >
            {order.status}
          </Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={{ marginBottom: 12 }}>
        {order.items.map((item, index) => (
          <Text key={index} style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      {/* Order Total */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
          Total: ${order.total.toFixed(2)}
        </Text>
        
        <TouchableOpacity
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          Order History
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
            Loading orders...
          </Text>
        </View>
      ) : orders.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
          }}
        >
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#666',
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            No orders yet
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
            When you place your first order, it will appear here
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#000',
              borderRadius: 20,
              paddingHorizontal: 24,
              paddingVertical: 12,
              marginTop: 20,
            }}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: spacing.sectionSpacing * 4,
          }}
          showsVerticalScrollIndicator={false}
        >
          {orders.map(renderOrderItem)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;