import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
  initializeSampleProducts,
  Product
} from '../../services/products';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = ['All Items', 'Dress', 'T-Shirt', 'Pants'];

interface ProductWithFavorite extends Product {
  isFavorite: boolean;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<ProductWithFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const router = useRouter();
   const [refreshing, setRefreshing] = useState(false);
  const { user, userProfile } = useAuth();

  // Load favorites from AsyncStorage
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

  // Load products from Firebase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Load favorites first
      const loadedFavorites = await loadFavorites();
      setFavorites(loadedFavorites);
      
      // await initializeSampleProducts();
      const fetchedProducts = await getAllProducts();
      const productsWithFavorites = fetchedProducts.map(product => ({
        ...product,
        isFavorite: loadedFavorites.has(product.id || ''),
      }));

      setProducts(productsWithFavorites);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchText]);

    const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, []);

  const filterProducts = async () => {
    try {
      setLoading(true);
      let fetchedProducts: Product[] = [];

      if (selectedCategory === 'All Items') {
        if (searchText) {
          fetchedProducts = await searchProducts(searchText);
        } else {
          fetchedProducts = await getAllProducts();
        }
      } else {
        fetchedProducts = await getProductsByCategory(selectedCategory);
        if (searchText) {
          fetchedProducts = fetchedProducts.filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.description.toLowerCase().includes(searchText.toLowerCase())
          );
        }
      }

      const productsWithFavorites = fetchedProducts.map(product => ({
        ...product,
        isFavorite: favorites.has(product.id || ''),
      }));

      setProducts(productsWithFavorites);
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId: string) => {
    try {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      
      // Update state
      setFavorites(newFavorites);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      
      // Update products
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? { ...product, isFavorite: !product.isFavorite }
            : product
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderProductItem = ({ item }: { item: ProductWithFavorite }) => (
    <TouchableOpacity
      style={{
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={() => router.push({ pathname: "/ProductsDetails/[id]", params: { id: item.name || 'cargo pants' } })}
    >
      <View style={{ position: 'relative' }}>
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
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 16,
            padding: 6,
          }}
          onPress={() => toggleFavorite(item.id || '')}
        >
          <Ionicons
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={item.isFavorite ? '#ff4444' : '#666'}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 14,
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
          fontSize: 12,
          color: '#666',
          marginBottom: 8,
        }}
      >
        {item.category}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000',
          }}
        >
          ${item.price}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text
            style={{
              fontSize: 12,
              color: '#666',
              marginLeft: 2,
            }}
          >
            {item.rating}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header Section */}
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
        <View>
          <Text
            style={{
              fontSize: 16,
              color: '#666',
              marginBottom: 4,
            }}
          >
            Hello, Welcome 👋
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            {userProfile?.displayName || user?.displayName || 'Guest'}
          </Text>
        </View>

        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#ddd',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <Image
            source={require('../../assets/images/icon.png')}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
            resizeMode="cover"
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      >
        {/* Search Section */}
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 15,
              paddingHorizontal: 16,
              paddingVertical: 8,
              // shadowColor: '#000',
              // shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: '#000',
              }}
              placeholder="Search clothes..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#000',
                borderRadius: 12,
                padding: 8,
                marginLeft: 12,
              }}
            >
              <Ionicons name="options" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Filter Tabs */}
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 24,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={{
                  backgroundColor: selectedCategory === category ? '#000' : '#fff',
                  borderRadius: 15,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderWidth: selectedCategory === category ? 0 : 1,
                  borderColor: '#e0e0e0',
                  shadowColor: selectedCategory === category ? '#000' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: selectedCategory === category ? 2 : 0,
                }}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: selectedCategory === category ? '#fff' : '#000',
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          {loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={{ marginTop: 16, color: '#666' }}>Loading products..</Text>
            </View>
          ) : (
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id || Math.random().toString()}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}