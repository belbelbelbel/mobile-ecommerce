import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, Image, StyleSheet, ImageBackground, Pressable, TouchableOpacity } from 'react-native';
import { products } from '@/constant/Content';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CategoriesPage() {
  const [shuffledProducts, setShuffledProducts] = useState<any>([]);
  const routes = useRouter()
  const [cart, setCart] = useState<any>([])

  useEffect(() => {
    setShuffledProducts(shuffleArray(products));
  }, []);

  const shuffleArray = (array: any) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleAddProducts = async (id: string) => {
    const productToAdd = products.find((product) => product.id === id);
    if (!productToAdd) {
      console.warn("Product not found!");
      return;
    }

    const isAlreadyInCart = cart.some((item: any) => item.id === id);
    if (!isAlreadyInCart) {
      const updatedCart = [...cart, productToAdd];
      setCart(updatedCart);

      try {
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        // console.log("Cart saved successfully:", updatedCart);
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    } else {
      alert("Product is already in the cart!");
    }
  };


  const handleLoaddata = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setCart(JSON.parse(value));
        // console.log("Loaded cart data:", JSON.parse(value));
      } else {
        console.log("Cart is empty");
      }
    } catch (error) {
      console.log("Error loading cart:", error);
    }
  };

  useEffect(() => {
    handleLoaddata('cart');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, paddingHorizontal: 9, alignItems: 'center', }}>
        <Pressable onPress={() => routes.back()} style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
          <Ionicons name="chevron-back" size={30} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Shop Now </Text>
        <Pressable style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
          <Ionicons name="cart" color={'black'} size={25} onPress={() => routes.push('/cart')} />
          <Text className='absolute right-0 -top-5 text-xl font-black text-red-700'>{cart.length}</Text>
        </Pressable>
      </View>
      <FlatList
        data={products}
        numColumns={2}
        // contentContainerStyle={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => routes.push({ pathname: "/ProductsDetails/[id]", params: { id: item.id } })} style={styles.productItem}>
            <View className="absolute top-3 left-5">
              <Text className="text-white font-black bg-black px-3 py-[2px] rounded-md">
                {item.rating} <Ionicons name='star' size={12} />
              </Text>
            </View>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price} $</Text>
            <TouchableOpacity
              onPress={() => handleAddProducts(item.id)}

              className="items-center h-[2.5rem] rounded-[6px] flex justify-center bg-black absolute bottom-4  mx-auto w-[88%]"
            >
              <Text className="text-white font-bold">Add to cart</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: 10,
    marginHorizontal: 'auto',
    height: '100%'
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  productItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 'auto',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 25,
    height: 250,
    display: 'flex',
    justifyContent: 'center',
  },
  rating: {
    position: 'absolute',
    top: 15,
    left: 25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 3,
    paddingHorizontal: 5,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    position: 'absolute',
    right: 10,
    top: 13
  },
});
