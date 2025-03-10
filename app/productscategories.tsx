import { View, Text, SafeAreaView, Pressable, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Productscategories = () => {
    const { products } = useLocalSearchParams<any>();
    const router = useRouter();
    const [cart, setCart] = useState([])
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

    // console.log("Received products:", products);

    const filteredProducts = products ? JSON.parse(products) : [];

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 30, paddingHorizontal: 20, alignItems: 'center' }}>
                <Pressable onPress={() => router.back()} style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
                    <Ionicons name="chevron-back" size={30} />
                </Pressable>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{filteredProducts[0].category}</Text>
                <Pressable style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
                    <Ionicons name="cart" color={'black'} size={25} onPress={() => router.push('/cart')} />
                    <Text className='absolute right-0 -top-4 text-xl font-black text-red-700'>{cart.length}</Text>
                </Pressable>

            </View>

            <ScrollView className='w-full' >
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product: any) => (
                        <TouchableOpacity onPress={() => router.push({ pathname: "/ProductsDetails/[id]", params: { id: product.id } })} key={product.id} className='w-[90%] rounded-[0.6rem] justify-between px-3 mx-auto h-[10rem] flex-row items-center  bg-white flex mb-5'>
                            <View>
                                <Image source={product.image} className='w-[8rem] rounded-[0.5rem] h-[6rem]' />
                            </View>
                            <Text className='font-bold text-[1.4rem] w-[60%] mx-auto'>{product.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{ fontSize: 18, textAlign: "center", marginTop: 20 }}>No products found</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Productscategories;
