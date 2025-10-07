import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart, CartItem } from '../../contexts/CartContext';
import { CartItemSkeleton } from '../../components/SkeletonLoader';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, cartCount, totalPrice, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    try {
      // Don't show skeleton loading for quantity updates, just update directly
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (item: CartItem) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${item.name}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFromCart(item.id || '');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearCart,
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add some items to your cart before checking out.');
      return;
    }
    Alert.alert('Coming Soon', 'Checkout functionality will be available soon!');
  };

  const renderCartItem = (item: CartItem) => {
    return (
      <View
        key={item.id}
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          marginHorizontal: 20,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Product Image */}
        <Image
          source={{ uri: item.imageUrl }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            marginRight: 16,
          }}
          resizeMode="cover"
        />

        {/* Product Details */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#000',
              marginBottom: 4,
            }}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 8,
            }}
          >
            ${item.price.toFixed(2)}
          </Text>

          {/* Quantity Controls */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#f0f0f0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleQuantityUpdate(item.id || '', Math.max(0, item.quantity - 1))}
                disabled={item.quantity <= 1}
              >
                <Ionicons name="remove" size={16} color={item.quantity <= 1 ? '#ccc' : '#000'} />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000',
                  marginHorizontal: 16,
                  minWidth: 20,
                  textAlign: 'center',
                }}
              >
                {item.quantity}
              </Text>

              <TouchableOpacity
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#f0f0f0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleQuantityUpdate(item.id || '', item.quantity + 1)}
                disabled={false}
              >
                <Ionicons name="add" size={16} color="#000" />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000',
              }}
            >
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 12,
            padding: 4,
          }}
          onPress={() => handleRemoveItem(item)}
          disabled={false}
        >
          <Ionicons name="close" size={16} color="#ff4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
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

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#000',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginRight: 12,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {cartItems.length > 0 && (
            <TouchableOpacity
              onPress={handleClearCart}
              style={{
                backgroundColor: '#ff4444',
                borderRadius: 8,
                padding: 8,
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          // Skeleton Loading
          <View>
            {Array.from({ length: 3 }).map((_, index) => (
              <CartItemSkeleton key={index} />
            ))}
          </View>
        ) : cartItems.length > 0 ? (
          // Cart Items
          <View style={{ paddingTop: 10 }}>
            {cartItems.map(renderCartItem)}
          </View>
        ) : (
          // Empty Cart
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60,
            }}
          >
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#666',
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Your cart is empty
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#999',
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              Add some items to your cart to see them here
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#000',
                borderRadius: 20,
                paddingHorizontal: 24,
                paddingVertical: 12,
              }}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Summary */}
      {cartItems.length > 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 100, // Extra padding to clear tab bar
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#000',
              }}
            >
              Total ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#000',
              }}
            >
              ${totalPrice.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#000',
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              opacity: loading ? 0.6 : 1,
            }}
            onPress={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Proceed to Checkout
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}