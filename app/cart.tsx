import { View, Text, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'react-native'

const cart = () => {
    const [cart, setCart] = useState([])
    const route = useRouter()
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
        <SafeAreaView className='w-full h-full '>
            <View className='' style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, paddingHorizontal: 9, alignItems: 'center',width: '90%',marginHorizontal:'auto' }}>
                <Pressable onPress={() => route.back()} style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
                    <Ionicons name="chevron-back" size={30} />
                </Pressable>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Shopping Cart </Text>
                <Pressable style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
                    <Ionicons name="cart" color={'black'} size={25} />
                    <Text className='absolute right-0 -top-5 text-xl font-black text-red-700'>{cart.length}</Text>
                </Pressable>
            </View>
            <ScrollView className='w-full' >
                {cart.length > 0 ? (
                    cart.map((product: any) => (
                        <TouchableOpacity onPress={() => route.push({ pathname: "/ProductsDetails/[id]", params: { id: product.id } })} key={product.id} className='w-[90%] rounded-[0.6rem] justify-between px-3 mx-auto h-[10rem] flex-row items-center  bg-white flex mb-5'>
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
    )
}

export default cart