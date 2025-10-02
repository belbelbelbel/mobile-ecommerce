import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="products" options={{ headerShown: false }} />
        <Stack.Screen name="categoriespage" options={{ headerShown: false }} />
        <Stack.Screen name="ProductsDetails/[id]" options={{headerShown: false}}/>
        <Stack.Screen name="productscategories" options={{headerShown:false}}/>
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="notification" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingScreen" options={{ headerShown: false }} />

        {/* <Stack.Screen name="productsdetails" options={{ headerShown: false }} /> */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
