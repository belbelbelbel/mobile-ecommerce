import React, { useEffect } from "react";
import { ImageBackground, Text, View, ActivityIndicator, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import LogoPart from "@/components/LogoPart";
import iconSet from "@expo/vector-icons/build/FontAwesome5";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { SplashScreen, useRouter } from "expo-router";
import '../global.css'

export default function Index() {
  const routes = useRouter()
  const [fontsLoaded] = useFonts({
    "ClashDisplay-Bold": require("../assets/fonts/ClashDisplay-Bold.ttf"),
  });

useEffect(() => {
  if (!fontsLoaded) {
       <ActivityIndicator size="large" color="blue" />;
  } else {
    SplashScreen.hideAsync();
  }
}, [fontsLoaded]);

  return (
    <ImageBackground
      source={require("../assets/images/bg-img.jpg")}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'wh', gap: 40 }}
      resizeMode="cover"
    >
      <LogoPart />
      <View style={{ position: 'relative', top: 30, width: '100%' }}>
        <Text style={styles.textcolor}>We Provide The Best Electronic Products From Great Brands </Text>
        <Text style={styles.textcolor2}>You Will Be Able to Find A Wide Collecton Of Electronics From Top Brands</Text>
      </View>
      <TouchableOpacity onPress={() => routes.navigate('/products')} style={{ backgroundColor: 'white', width: 60, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 100, borderRadius: 10 }}>
        <Ionicons name="arrow-forward-outline" style={{ color: 'black' }} size={30}  />
      </TouchableOpacity>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  textcolor: {
    color: "white",
    textAlign: 'center',
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 20,
    lineHeight: 35,
  },
  textcolor2: {
    color: "white",
    width: '88%',
    marginHorizontal: 'auto',
    opacity: 0.8,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  }

})

