import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../services/products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  totalPrice: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  loading: false,
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from AsyncStorage on app start
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addNotification = async (message: string) => {
    try {
      const existingNotifications = await AsyncStorage.getItem('notify');
      let notificationsArray: string[] = [];
      
      if (existingNotifications) {
        try {
          notificationsArray = JSON.parse(existingNotifications);
          if (!Array.isArray(notificationsArray)) {
            notificationsArray = [];
          }
        } catch (error) {
          notificationsArray = [];
        }
      }
      
      notificationsArray.push(message);
      await AsyncStorage.setItem('notify', JSON.stringify(notificationsArray));
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      setLoading(true);
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      let updatedCart: CartItem[];

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        updatedCart = cartItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        await addNotification(`Updated ${product.name} quantity in cart.`);
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          ...product,
          quantity
        };
        updatedCart = [...cartItems, newCartItem];
        await addNotification(`${product.name} added to cart.`);
      }

      setCartItems(updatedCart);
      await saveCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      const itemToRemove = cartItems.find(item => item.id === productId);
      const updatedCart = cartItems.filter(item => item.id !== productId);
      
      setCartItems(updatedCart);
      await saveCart(updatedCart);
      
      if (itemToRemove) {
        await addNotification(`${itemToRemove.name} removed from cart.`);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const updatedCart = cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      );

      setCartItems(updatedCart);
      await saveCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setCartItems([]);
      await AsyncStorage.removeItem('cart');
      await addNotification('Cart cleared.');
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate derived values
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    cartItems,
    cartCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};