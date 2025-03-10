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

    const handleRemoveProduct = async (id: string,name: string) => {
        try {
          const updatedCart = cart.filter((item: any) => item.id !== id);
          setCart(updatedCart);
      
          setTimeout(async () => {
            try {
              await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
              const existingNotifications = await AsyncStorage.getItem("notify");
              let notificationsArray = [];
              if (existingNotifications) {
                try {
                  notificationsArray = JSON.parse(existingNotifications);
                  if (!Array.isArray(notificationsArray)) {
                    console.error("Invalid notification format, resetting...");
                    notificationsArray = [];
                  }
                } catch (parseError) {
                  console.error("Error parsing notifications:", parseError);
                  notificationsArray = [];
                }
              }
      
              // ✅ Add a new notification for item removal
              const newNotification = `Item removed ${name} from cart.`;
              notificationsArray.push(newNotification);
      
              await AsyncStorage.setItem("notify", JSON.stringify(notificationsArray));
      
              // console.log("Item removed & notification saved successfully!");333
            } catch (storageError) {
              console.error("Error saving cart or notification:", storageError);
            }
          }, 100);
        } catch (error) {
          console.error("Unexpected error in handleRemoveProduct:", error);
        }
      };
      





    return (
        <SafeAreaView className='w-full h-full '>
            <View className='' style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, paddingHorizontal: 9, alignItems: 'center', width: '90%', marginHorizontal: 'auto' }}>
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
                            <Text className='font-bold text-[1.2rem] w-[45%] mx-auto'>{product.name}</Text>
                            <Pressable onPress={() => handleRemoveProduct(product.id,product.name)} className='absolute top-3  right-5'><Text className='text-red-900'><Ionicons className='' color={''} name='close-circle' size={25} /></Text></Pressable>
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