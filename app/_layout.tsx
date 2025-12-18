import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { BookingProvider } from "../context/BookingContext";
import { FavoritesProvider } from "../context/FavoritesContext";

function InitialLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not already in auth pages
      router.replace("/auth/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated but still in auth pages
      router.replace("/(tabs)/explore");
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{
        headerShown: true,
        title: "Sign In",
        headerLeft: () => null // Prevent back button to tabs
      }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <BookingProvider>
        <FavoritesProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <InitialLayout />
            <StatusBar style="auto" />
          </ThemeProvider>
        </FavoritesProvider>
      </BookingProvider>
    </AuthProvider>
  );
}
