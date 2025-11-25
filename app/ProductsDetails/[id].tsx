import { View, Text, Image, SafeAreaView, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllProducts } from "@/services/products";

export interface Product {
    id?: string;
    name: string;
    category: string;
    price: number;
    description: string;
    imageUrl: string;
    rating: number;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export default function ProductDetails() {
    const [count, setCount] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<any>([])
    const { id } = useLocalSearchParams();
    const routes = useRouter()
    const resolvedId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);
    const [loadingProduct, setLoadingProduct] = useState(true);

    const route = useRouter();
    const getParameters = async() => {
        try {
            setLoadingProduct(true);
            const fetchedProducts = await getAllProducts();
            setProducts(fetchedProducts)
        } catch (error) {
            console.log("Error loading product:", error);
        } finally {
            setLoadingProduct(false);
        }
    }
    useEffect(() => {
        getParameters()
    }, [])
    const product = useMemo(
        () =>
            products.find(
                (item) =>
                    (resolvedId && item.id === resolvedId) ||
                    item.name.toString() === resolvedId
            ),
        [products, resolvedId]
    );
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

    const handleAddProducts = async (id: string) => {
        const productToAdd = products.find(
            (product) => product.id === id || product.name === id
        );
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


    if (loadingProduct) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#111" />
                <Ionicons name="shirt-outline" size={36} color="#d1d5db" style={{ marginTop: 24 }} />
                <Text className="mt-3 text-base text-gray-500">Loading product...</Text>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white px-8">
                <Ionicons name="alert-circle-outline" size={48} color="#f97316" />
                <Text className="mt-4 text-xl font-semibold text-gray-900">Product not found</Text>
                <Text className="mt-2 text-center text-base text-gray-500">
                    We couldn't load this item. Please go back and try again.
                </Text>
                <Pressable
                    className="mt-8 px-6 py-3 rounded-2xl bg-black"
                    onPress={() => routes.back()}
                >
                    <Text className="text-white font-semibold">Back to shopping</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 items-center bg-white pb-5">
            <View className="h-[51%] w-screen bg-gray-100 items-center justify-center">
                <View className="w-full flex-row items-center absolute top-7 justify-between px-10">
                    <Pressable onPress={() => route.back()} className="w-12 h-12 bg-white justify-center items-center rounded-2xl">
                        <Ionicons name="chevron-back" size={30} />
                    </Pressable>
                    <Pressable className="w-12 h-12 bg-white justify-center items-center rounded-2xl">
                        <Ionicons name="cart" color={'black'} size={25} onPress={() => route.push('/(tabs)/cart')} />
                        <Text className='absolute right-0 -top-4 text-2xl font-black text-red-700'>{cart.length}</Text>
                    </Pressable>
                </View>
                <Image source={{uri: product.imageUrl}} className="w-72 h-72 rounded-full" />
            </View>

            {/* Product Info Section */}
            <View className="flex-row w-full mt-9 px-6 items-center justify-between">
                <Text className="font-black text-2xl w-[50%]">{product.name}</Text>

                {/* Quantity Selector */}
                <View className="bg-gray-200 flex rounded-md items-center justify-center h-12 w-32">
                    <View className="flex-row gap-4 items-center">
                        <Pressable onPress={() => setCount(Math.max(0, count - 1))}>
                            <Text className="text-3xl font-bold">-</Text>
                        </Pressable>
                        <Text className="text-2xl font-bold">{count}</Text>
                        <Pressable onPress={() => setCount(count + 1)}>
                            <Text className="text-3xl font-bold">+</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            <View className="px-6 my-6">
                <Text className="text-lg font-bold">Description</Text>
                <Text className="text-base leading-6 mt-2">{product.description}</Text>
            </View>
            <View className="absolute top-52 right-5">
                <Text className="text-white font-black bg-black px-3 py-2 rounded-md">
                    {product.rating} <Ionicons name='star' size={12} />
                </Text>
            </View>
            <View className="w-full absolute bottom-12">
                <Pressable
                    className="w-[80%] mx-auto rounded-[1.5rem] h-16 bg-black text-white font-bold items-center justify-center "
                    onPress={() => handleAddProducts(product.id || product.name)}
                >
                    <Text className="text-white font-bold">Add to Cart</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
