import { View, Text, SafeAreaView, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const NotificationScreen = () => {
  const route = useRouter()
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
  }, []);

  const handleRemove = (id:string) => {
    AsyncStorage.removeItem("notify");
    const filterdArray = notifications.filter((items:any)=> items !== id);
    setNotifications(filterdArray)
  }
  return (
    <SafeAreaView style={{ flex: 1, padding: 20, }}>
      <View className='' style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, paddingHorizontal: 0, alignItems: 'center', width: '90%', marginHorizontal: 'auto' }}>
        <Pressable onPress={() => route.back()} style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
          <Ionicons name="chevron-back" size={30} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notifications </Text>
      </View>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="flex flex-row w-[93%] mx-auto gap-3 mb-2 items-center h-[7rem]" style={{ backgroundColor: "#f8f8f8", padding: 10, marginBottom: 20, borderRadius: 5 }}>
              <Text>
                <Ionicons name="notifications" size={40} color={'black'} />
              </Text>
              <Text className="w-[50%] font-bold text-lg">{item}</Text>
              <Text onPress={() => handleRemove(item)} className="absolute text-red-700 top-8 right-8" ><Ionicons name="close-circle"  size={26}/></Text>
            </View>
          )}
        />
      ) : (
        <Text className="text-center text-black absolute top-80 right-40 text-2xl">No new notifications</Text>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
