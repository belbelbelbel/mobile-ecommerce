import { View, Text, SafeAreaView, Image, StyleSheet, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ImageContent from '@/components/ImageContent';
import CategoriesContents from '@/components/CategoriesContents';
import TopDeals from '@/components/TopDeals';
import { FlatList } from 'react-native';
import { products } from '@/constant/Content';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type item = {
    id: string;
    category: string;
    name: string;
    price: number;
    image: any;
    description: string;
    rating: number;
}[]
export default function Products() {
    const [text, setText] = useState('');
    const routes = useRouter()
    const handleFilterInputs = (value: string) => {
        if (!value.trim()) return; 
        const lowerCaseValue = value.toLowerCase();
        const filteredProducts: item = products.filter(
            (item) =>
                item.category.toLowerCase().includes(lowerCaseValue) || 
                item.name.toLowerCase().includes(lowerCaseValue)
        );
    
        if (filteredProducts.length > 0) {
            routes.push({
                pathname: "/productscategories",
                params: { products: JSON.stringify(filteredProducts) },
            });
            setText('');
        } else {
            alert(`No results found for "${value}"`);
        }
    };

    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
      const loadNotifications = async () => {
        try {
          const value = await AsyncStorage.getItem("notify");
          if (value !== null) {
            setNotifications(JSON.parse(value));
          }
        } catch (error) {
          console.error("Error loading notifications:", error);
        }
      };
      loadNotifications();
      // return () => {
      //     AsyncStorage.removeItem("notify");
      // };
    }, [AsyncStorage.getItem("notify")]);

    console.log(notifications.length)
  
    

    const data = [{}];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', gap: 10 }}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={() => (
                    <View style={{ width: '90%', alignSelf: 'center' }}>
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <Image source={require('../assets/images/whitelg.png')} style={styles.logo} />
                                <Text style={styles.logoText}>Leuze</Text>
                            </View>
                            <View style={styles.iconContainer}>
                                <Ionicons name="notifications-circle-outline" size={35} color="black" onPress={() => routes.push('/notification')}/>
                                <Text className='text-black absolute -top-2 text-red-700 font-black'>{notifications.length}</Text>
                                <Ionicons name="menu-outline" size={35} color="black" />
                            </View>
                        </View>

                        {/* <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Try search here.."
                                placeholderTextColor="#8c8c8c"
                                value={text}
                                onChangeText={setText}
                            />
                            <Ionicons name="search" size={20} color="#8c8c8c" style={styles.searchIcon} onPress={() => handleFilterInputs(text)} />
                        </View> */}

                        <ImageContent />
                        <CategoriesContents />
                        <TopDeals />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    header: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    logo: {
        height: 25,
        width: 25,
    },
    logoText: {
        color: "black",
        fontSize: 30,
        fontFamily: "ClashDisplay-Bold",
        letterSpacing: 2,
    },
    iconContainer: {
        flexDirection: 'row',
        gap: 10,
    },

    searchContainer: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        elevation: 3,
        // borderColor: "#000",
        marginVertical: 15
    },

    searchInput: {
        flex: 1,
        height: 55,
        fontSize: 16,
        color: 'black',
    },
    searchIcon: {
        marginLeft: 10,
    },
});
