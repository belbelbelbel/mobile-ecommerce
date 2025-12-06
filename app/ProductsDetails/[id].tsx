import { View, Text, Image, SafeAreaView, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { getAllProducts, type Product } from "@/services/products";
import { useCart } from "@/contexts/CartContext";


export default function ProductDetails() {
    const [count, setCount] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const { id } = useLocalSearchParams();
    const routes = useRouter()
    const resolvedId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);
    const [loadingProduct, setLoadingProduct] = useState(true);

    const route = useRouter();
    const { cartCount, addToCart } = useCart();
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
    const handleAddProducts = async () => {
        if (!product) return;
        try {
            const quantity = Math.max(1, count || 1);
            await addToCart(product, quantity);
            setCount(0);
        } catch (error) {
            console.error("Error adding product to cart from details page:", error);
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
                    <Pressable
                        className="w-12 h-12 bg-white justify-center items-center rounded-2xl"
                        onPress={() => route.push('/(tabs)/cart')}
                    >
                        <Ionicons name="cart" color={'black'} size={25} />
                        {cartCount > 0 && (
                            <Text className="absolute right-0 -top-3 text-xs font-black text-red-700 bg-white px-1 rounded-full">
                                {cartCount > 99 ? '99+' : cartCount}
                            </Text>
                        )}
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
                    onPress={handleAddProducts}
                >
                    <Text className="text-white font-bold">Add to Cart</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
