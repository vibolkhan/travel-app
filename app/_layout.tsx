import { Stack } from "expo-router";
import { BookingProvider } from "../context/BookingContext";
import { FavoritesProvider } from "../context/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <BookingProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </BookingProvider>
    </FavoritesProvider>
  );
}
