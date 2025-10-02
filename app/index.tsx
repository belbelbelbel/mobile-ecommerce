import React, { useEffect } from "react";
import {
  ImageBackground,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import LogoPart from "@/components/LogoPart";
import { SplashScreen, useRouter } from "expo-router";
import "../global.css";

export default function Index() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "ClashDisplay-Bold": require("../assets/fonts/ClashDisplay-Bold.ttf"),
  });

  // Prevent splash screen from auto-hiding before fonts are loaded
  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();

      // ⏳ Navigate to OnboardingScreen after 2.5s
      const timer = setTimeout(() => {
        router.replace("/OnboardingScreen");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <ImageBackground
      source={require("../assets/images/bg-img.jpg")}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      resizeMode="cover"
    >
      <LogoPart />
      <StatusBar barStyle={"default"} />
    </ImageBackground>
  );
}
