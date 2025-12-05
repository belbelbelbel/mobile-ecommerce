import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  getAllProducts,
  initializeSampleProducts,
  Product,
} from '../../services/products';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductGridSkeleton } from '../../components/SkeletonLoader';
import { useToast } from '../../contexts/ToastContext';
import { useDebounce } from 'use-debounce';
import { colors, layout, spacing, surfaces } from '@/styles/theme';

const DEFAULT_CATEGORY = 'All Items';

interface ProductWithFavorite extends Product {
  isFavorite: boolean;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [searchText, setSearchText] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<ProductWithFavorite[]>([]);
  const [categories, setCategories] = useState<string[]>([DEFAULT_CATEGORY]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { user, userProfile } = useAuth();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debouncedSearch] = useDebounce(searchText, 350);

  const loadFavorites = async (): Promise<Set<string>> => {
    try {
      const favoritesData = await AsyncStorage.getItem('favorites');
      if (favoritesData) {
        const favoritesArray: string[] = JSON.parse(favoritesData);
        return new Set(favoritesArray);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    return new Set<string>();
  };

  const loadProducts = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
      setLoading(true);
        }
        setErrorMessage(null);
      const loadedFavorites = await loadFavorites();
      setFavorites(loadedFavorites);

        let fetchedProducts = await getAllProducts();
        if (fetchedProducts.length === 0) {
          await initializeSampleProducts();
          fetchedProducts = await getAllProducts();
        }

        setAllProducts(fetchedProducts);

        const derivedCategories = [
          DEFAULT_CATEGORY,
          ...Array.from(
            new Set(
              fetchedProducts
                .map((product) => product.category)
                .filter((category) => Boolean(category)),
            ),
          ),
        ];
        setCategories(derivedCategories);
        setSelectedCategory((prev) =>
          prev === DEFAULT_CATEGORY || derivedCategories.includes(prev) ? prev : DEFAULT_CATEGORY,
        );
    } catch (error) {
      console.error('Error loading products:', error);
        setErrorMessage('Failed to load products.');
        showToast('Failed to load products. Pull to refresh to retry.', 'error');
    } finally {
        if (!silent) {
      setLoading(false);
    }
      }
    },
    [showToast],
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

    const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts(true);
    setRefreshing(false);
  }, [loadProducts]);

  useEffect(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    const filteredProducts = allProducts
      .filter((product) =>
        selectedCategory === DEFAULT_CATEGORY ? true : product.category === selectedCategory,
      )
      .filter((product) => {
        if (!normalizedSearch) {
          return true;
        }
        return (
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch) ||
          product.category.toLowerCase().includes(normalizedSearch)
        );
      })
      .map((product) => ({
        ...product,
        isFavorite: favorites.has(product.id || ''),
      }));

    setProducts(filteredProducts);
  }, [allProducts, favorites, selectedCategory, debouncedSearch]);

  const toggleFavorite = async (productId: string) => {
    if (!productId) {
      return;
    }
    try {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Unable to update favorites. Please try again.', 'error');
    }
  };

  const handleAddToCart = async (product: ProductWithFavorite) => {
    try {
      setAddingToCart(product.id || '');
      await addToCart(product);
      showToast(`${product.name} added to cart!`, 'success');
    } catch (error) {
      showToast('Failed to add item to cart. Please try again.', 'error');
    } finally {
      setAddingToCart(null);
    }
  };

  const renderProductItem = ({ item }: { item: ProductWithFavorite }) => (
    <TouchableOpacity
      style={[
        surfaces.card,
        {
        width: '48%',
        padding: 12,
          marginBottom: spacing.sectionSpacing - 8,
        },
      ]}
      onPress={() =>
        router.push({
          pathname: '/ProductsDetails/[id]',
          params: { id: item.id || item.name || '' },
        })
      }
    >
      <View style={{ position: 'relative' }}>
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
          onPress={() => toggleFavorite(item.id || '')}
        >
          <Ionicons
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={16}
            color={item.isFavorite ? '#ef4444' : '#9ca3af'}
          />
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

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
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
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Add to Cart</Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View
      style={{
        paddingHorizontal: spacing.screenPadding,
        paddingBottom: spacing.sectionSpacing / 1.5,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 4 }}>Hello, Welcome 👋</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111' }}>
            {userProfile?.displayName || user?.displayName || 'Guest'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: userProfile?.photoURL || user?.photoURL ? 'transparent' : '#000',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderWidth: userProfile?.photoURL || user?.photoURL ? 2 : 0,
            borderColor: '#000',
          }}
        >
          {userProfile?.photoURL || user?.photoURL ? (
            <Image
              source={{ uri: userProfile?.photoURL || user?.photoURL || '' }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="bag" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
          borderRadius: 12,
              paddingHorizontal: 16,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: spacing.sectionSpacing - 8,
        }}
      >
        <Ionicons name="search" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
            color: '#111',
            padding: 0,
              }}
          placeholder="Search products..."
          placeholderTextColor="#9ca3af"
              value={searchText}
              onChangeText={setSearchText}
            />
        {searchText.length > 0 && (
            <TouchableOpacity
            onPress={() => setSearchText('')}
              style={{
              width: 24,
              height: 24,
                borderRadius: 12,
              backgroundColor: '#f3f4f6',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
            }}
          >
            <Ionicons name="close-circle" size={16} color="#6b7280" />
            </TouchableOpacity>
        )}
        </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
              <TouchableOpacity
                key={category}
                style={{
                backgroundColor: isActive ? '#000' : '#fff',
                  borderRadius: 15,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                borderWidth: 1,
                borderColor: isActive ? '#000' : colors.border,
                marginRight: 12,
                }}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                  color: isActive ? '#fff' : '#000',
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
          );
        })}
          </ScrollView>
        </View>
  );

  const renderEmptyState = () => (
        <View
      style={{
        paddingHorizontal: spacing.screenPadding,
        paddingTop: spacing.sectionSpacing * 2.5,
        alignItems: 'center',
      }}
    >
      <Ionicons
        name={errorMessage ? 'alert-circle-outline' : 'search-outline'}
        size={64}
        color="#d1d5db"
        style={{ marginBottom: 16 }}
      />
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 8 }}>
        {errorMessage ? 'Unable to load products' : 'No items found'}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: 20,
          lineHeight: 20,
        }}
      >
        {errorMessage
          ? 'Please pull to refresh or try again shortly.'
          : 'Try adjusting your search or category filters.'}
      </Text>
      {errorMessage && (
        <TouchableOpacity
          onPress={() => loadProducts()}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: '#111',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: spacing.sectionSpacing * 3,
      }}
    >
      <ActivityIndicator size="large" color="#111" />
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Ionicons name="shirt-outline" size={32} color="#d1d5db" style={{ marginBottom: 8 }} />
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>Loading products...</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={layout.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

          {loading ? (
        <>
          {renderHeader()}
          {renderLoadingState()}
        </>
          ) : (
            <FlatList
              data={products}
              renderItem={renderProductItem}
          keyExtractor={(item, index) => item.id || `${item.name}-${index}`}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
            paddingHorizontal: spacing.screenPadding,
          }}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ paddingBottom: spacing.sectionSpacing * 5 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
              showsVerticalScrollIndicator={false}
            />
          )}
    </SafeAreaView>
  );
}