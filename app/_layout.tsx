import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { ToastProvider } from "../contexts/ToastContext";

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="products" options={{ headerShown: false }} />
            <Stack.Screen name="categoriespage" options={{ headerShown: false }} />
            <Stack.Screen name="ProductsDetails/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="productscategories" options={{ headerShown: false }} />
            <Stack.Screen name="cart" options={{ headerShown: false }} />
            <Stack.Screen name="checkout" options={{ headerShown: false }} />
            <Stack.Screen name="notification" options={{ headerShown: false }} />
            <Stack.Screen name="order-history" options={{ headerShown: false }} />
            <Stack.Screen name="shipping-address" options={{ headerShown: false }} />
            <Stack.Screen name="help-support" options={{ headerShown: false }} />
            <Stack.Screen name="signin" options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingScreen" options={{ headerShown: false }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
