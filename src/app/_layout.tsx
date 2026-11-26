import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { RentalProvider } from "../context/RentalContext";
import { FavoriteProvider } from "../context/FavoriteContext";
import { CartProvider } from "../context/CartContext";

function SplashScreen() {
  return (
    <View style={layoutStyles.splashContainer}>
      <View style={layoutStyles.splashCard}>
        <Image
          source={require("../../assets/images/sewakuy-splash-logo.png")}
          style={layoutStyles.splashLogo}
        />
      </View>
      <ActivityIndicator size="small" color="#ffffff" style={{ marginTop: 24 }} />
      <Text style={layoutStyles.splashText}>Sewa Mudah, Cepat & Aman</Text>
    </View>
  );
}

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Tampilkan splash screen selama 1.5 detik saat peluncuran
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || isSplashVisible) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, isSplashVisible, segments]);

  if (isLoading || isSplashVisible) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RentalProvider>
        <FavoriteProvider>
          <CartProvider>
            <RouteGuard>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="item/[id]" options={{ headerShown: false }} />
              </Stack>
            </RouteGuard>
          </CartProvider>
        </FavoriteProvider>
      </RentalProvider>
    </AuthProvider>
  );
}

const layoutStyles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#1e3a8a", // Warna biru elegan sesuai permintaan
    alignItems: "center",
    justifyContent: "center",
  },
  splashCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  splashLogo: {
    width: 200,
    height: 80,
    resizeMode: "contain",
  },
  splashText: {
    color: "#bfdbfe",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
    letterSpacing: 0.5,
  },
});
