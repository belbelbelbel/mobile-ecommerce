import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart, CartItem } from '../../contexts/CartContext';
import { CartItemSkeleton } from '../../components/SkeletonLoader';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../contexts/ToastContext';
import { colors, layout, spacing, surfaces } from '@/styles/theme';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, cartCount, totalPrice, removeFromCart, updateQuantity, clearCart, loading } =
    useCart();
  const { showToast } = useToast();
  const [confirmationState, setConfirmationState] = useState<{
    visible: boolean;
    type: 'remove' | 'clear';
    item?: CartItem;
  }>({ visible: false, type: 'remove' });
  const [confirmationLoading, setConfirmationLoading] = useState(false);

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    try {
      // Don't show skeleton loading for quantity updates, just update directly
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      showToast('Failed to update quantity. Please try again.', 'error');
    }
  };

  const promptRemoveItem = (item: CartItem) => {
    setConfirmationState({ visible: true, type: 'remove', item });
  };

  const promptClearCart = () => {
    setConfirmationState({ visible: true, type: 'clear' });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Add items to your cart before checking out.', 'info');
      return;
    }
    router.push('/checkout');
  };

  const closeConfirmation = () => {
    setConfirmationState((prev) => ({ ...prev, visible: false, item: undefined }));
    setConfirmationLoading(false);
  };

  const handleConfirmAction = async () => {
    if (!confirmationState.visible) {
      return;
    }

    try {
      setConfirmationLoading(true);
      if (confirmationState.type === 'remove' && confirmationState.item) {
        await removeFromCart(confirmationState.item.id || '');
        showToast(`${confirmationState.item.name} removed from cart.`, 'success');
      } else if (confirmationState.type === 'clear') {
        await clearCart();
        showToast('Cart cleared.', 'info');
      }
      closeConfirmation();
    } catch (error) {
      console.error('Cart action error:', error);
      showToast('Something went wrong. Please try again.', 'error');
      setConfirmationLoading(false);
    }
  };

  const renderCartItem = (item: CartItem) => {
    return (
      <View
        key={item.id}
        style={[
          surfaces.card,
          {
            padding: 16,
            marginHorizontal: spacing.screenPadding,
            marginBottom: spacing.sectionSpacing - 8,
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}
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
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#f3f4f6',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}
          onPress={() => promptRemoveItem(item)}
          disabled={false}
        >
          <Ionicons name="close" size={14} color="#6b7280" />
        </TouchableOpacity>
      </View>
    );
  };

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
              onPress={promptClearCart}
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: 8,
                padding: 8,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.sectionSpacing * 3 }}
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
            paddingHorizontal: spacing.screenPadding,
            paddingTop: 20,
            paddingBottom: 100,
            borderTopWidth: 1,
            borderColor: colors.border,
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

      <ConfirmationModal
        visible={confirmationState.visible}
        title={confirmationState.type === 'remove' ? 'Remove Item' : 'Clear Cart'}
        message={
          confirmationState.type === 'remove'
            ? `Remove "${confirmationState.item?.name}" from your cart?`
            : 'This will remove every item from your cart.'
        }
        confirmText={confirmationState.type === 'remove' ? 'Remove' : 'Clear'}
        cancelText="Keep Items"
        loading={confirmationLoading}
        onCancel={closeConfirmation}
        onConfirm={handleConfirmAction}
      />
    </SafeAreaView>
  );
}