import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { colors, layout, spacing, surfaces } from '@/styles/theme';

const paymentMethods = [
  { id: 'card', label: 'Visa **** 4242', icon: 'card-outline' },
  { id: 'apple', label: 'Apple Pay', icon: 'logo-apple' },
  { id: 'paypal', label: 'PayPal', icon: 'logo-paypal' },
];

const CheckoutScreen = () => {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [processing, setProcessing] = useState(false);

  const shippingCost = useMemo(() => (totalPrice >= 150 ? 0 : 9.99), [totalPrice]);
  const orderTotal = useMemo(() => totalPrice + shippingCost, [totalPrice, shippingCost]);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showToast('Add items to your cart before checking out.', 'info');
      router.back();
      return;
    }

    try {
      setProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1400));
      await clearCart();
      showToast('Order placed successfully! 🎉', 'success');
      router.replace('/order-history');
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Something went wrong while placing your order.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={layout.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

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
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>Checkout</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing.screenPadding,
          paddingTop: spacing.sectionSpacing / 1.5,
          paddingBottom: spacing.sectionSpacing * 4,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Shipping */}
        <View
          style={[
            surfaces.card,
            {
              padding: 18,
              marginBottom: spacing.sectionSpacing - 8,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>Shipping Address</Text>
            <TouchableOpacity>
              <Text style={{ color: '#2563eb', fontWeight: '600' }}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 15, color: '#4b5563', lineHeight: 22 }}>
            Alex Johnson{'\n'}
            123 Market Street, Suite 600{'\n'}
            San Francisco, CA 94103
          </Text>
        </View>

        {/* Payment */}
        <View
          style={[
            surfaces.card,
            {
              padding: 18,
              marginBottom: spacing.sectionSpacing - 8,
            },
          ]}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 }}>
            Payment Method
          </Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: method.id === paymentMethods[paymentMethods.length - 1].id ? 0 : 1,
                borderBottomColor: '#f3f4f6',
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#f3f4f6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name={method.icon as any} size={20} color="#111" />
              </View>
              <Text style={{ flex: 1, fontSize: 15, color: '#111' }}>{method.label}</Text>
              <Ionicons
                name={selectedPayment === method.id ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={selectedPayment === method.id ? '#111' : '#9ca3af'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Items */}
        <View
          style={[
            surfaces.card,
            {
              padding: 18,
              marginBottom: spacing.sectionSpacing - 8,
            },
          ]}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 }}>
            Order Items
          </Text>
          {cartItems.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 64, height: 64, borderRadius: 12, marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 4 }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>
                  Qty {item.quantity} · ${item.price.toFixed(2)}
                </Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View
          style={[
            surfaces.card,
            {
              padding: 18,
            },
          ]}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 16 }}>
            Order Summary
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', fontSize: 15 }}>Subtotal</Text>
            <Text style={{ color: '#111', fontWeight: '600', fontSize: 15 }}>
              ${totalPrice.toFixed(2)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', fontSize: 15 }}>Shipping</Text>
            <Text style={{ color: '#111', fontWeight: '600', fontSize: 15 }}>
              {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#f3f4f6',
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#111' }}>Total</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111' }}>
              ${orderTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: spacing.screenPadding,
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: colors.border,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#000',
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            opacity: processing ? 0.7 : 1,
          }}
          onPress={handlePlaceOrder}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="lock-closed-outline" size={18} color="#fff" />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '700',
                  marginLeft: 8,
                }}
              >
                Place Order · ${orderTotal.toFixed(2)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

