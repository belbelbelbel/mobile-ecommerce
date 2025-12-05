import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAllProducts, Product } from '../../services/products';
import { useCart } from '../../contexts/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { ProductGridSkeleton } from '../../components/SkeletonLoader';
import { layout, spacing, surfaces } from '@/styles/theme';

interface ProductWithFavorite extends Product {
  isFavorite: boolean;
}

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<ProductWithFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      const storageKey = user?.uid ? `favorites_${user.uid}` : 'favorites_guest';
      const favoritesData = await AsyncStorage.getItem(storageKey);
      if (favoritesData) {
        const favoritesArray = JSON.parse(favoritesData);
        setFavorites(new Set(favoritesArray));
        return new Set(favoritesArray);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    return new Set<string>();
  };

  // Load favorite products
  const loadFavoriteProducts = async () => {
    try {
      setLoading(true);
      const favoritesSet = await loadFavorites();
      
      if (favoritesSet.size === 0) {
        setFavoriteProducts([]);
        return;
      }

      const allProducts = await getAllProducts();
      const favorited = allProducts
        .filter(product => favoritesSet.has(product.id || ''))
        .map(product => ({ ...product, isFavorite: true }));
      
      setFavoriteProducts(favorited);
    } catch (error) {
      console.error('Error loading favorite products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove from favorites
  const removeFavorite = async (productId: string) => {
    try {
      const newFavorites = new Set(favorites);
      newFavorites.delete(productId);
      setFavorites(newFavorites);
      
      const storageKey = user?.uid ? `favorites_${user.uid}` : 'favorites_guest';
      await AsyncStorage.setItem(storageKey, JSON.stringify(Array.from(newFavorites)));
      
      setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleAddToCart = async (product: ProductWithFavorite) => {
    try {
      setAddingToCart(product.id || '');
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavoriteProducts();
    setRefreshing(false);
  }, []);

  // Reload favorites when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavoriteProducts();
    }, [])
  );

  const renderFavoriteItem = ({ item }: { item: ProductWithFavorite }) => (
    <TouchableOpacity
      style={[
        surfaces.card,
        {
          width: '48%',
          padding: 12,
          marginBottom: spacing.sectionSpacing - 8,
        },
      ]}
      onPress={() => router.push({ pathname: "/ProductsDetails/[id]", params: { id: item.name || '' } })}
    >
      <View style={{ position: 'relative' }}>
        {/* Rating - Top Left */}
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 8,
            paddingHorizontal: 6,
            paddingVertical: 3,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Ionicons name="star" size={10} color="#fbbf24" />
          <Text
            style={{
              fontSize: 10,
              color: '#fff',
              marginLeft: 3,
              fontWeight: '600',
            }}
          >
            {item.rating}
          </Text>
        </View>

        {/* Remove Favorite Button - Top Right */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            zIndex: 1,
          }}
          onPress={() => removeFavorite(item.id || '')}
        >
          <Ionicons name="heart" size={16} color="#ef4444" />
        </TouchableOpacity>

        <Image
          source={{ uri: item.imageUrl }}
          style={{
            width: '100%',
            height: 140,
            borderRadius: 12,
            marginBottom: 12,
          }}
          resizeMode="cover"
        />
      </View>

      {/* Product Info */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#111',
          marginBottom: 4,
          lineHeight: 18,
        }}
        numberOfLines={2}
      >
        {item.name}
      </Text>

      <Text
        style={{
          fontSize: 12,
          color: '#6b7280',
          marginBottom: 8,
        }}
      >
        {item.category}
      </Text>

      {/* Price */}
      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#111',
          }}
        >
          ${item.price}
        </Text>
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          borderRadius: 12,
          paddingVertical: 10,
          alignItems: 'center',
          opacity: addingToCart === item.id ? 0.6 : 1,
        }}
        onPress={() => handleAddToCart(item)}
        disabled={addingToCart === item.id}
      >
        {addingToCart === item.id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
            Add to Cart
          </Text>
        )}
      </TouchableOpacity>
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
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#111',
          }}
        >
          Favorites
        </Text>
        {favoriteProducts.length > 0 && (
          <Text
            style={{
              fontSize: 16,
              color: '#6b7280',
              marginLeft: 8,
            }}
          >
            ({favoriteProducts.length})
          </Text>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <ProductGridSkeleton />
      ) : favoriteProducts.length === 0 ? (
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
        <FlatList
          data={favoriteProducts}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id || Math.random().toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            paddingHorizontal: spacing.screenPadding,
          }}
          contentContainerStyle={{
            paddingBottom: spacing.sectionSpacing * 3,
            paddingTop: 10,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}