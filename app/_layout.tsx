import { Slot, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";

import { IconSymbol } from "@/components/IconSymbol";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import React from "react";
import { Colors } from "../constants/Colors";

const BREAKPOINT_MD = 900;

const ITEMS = [
  { href: "/(tabs)/explore", title: "Explore", icon: "mappin.and.ellipse" },
  { href: "/(tabs)/favorite", title: "Saved", icon: "heart.fill" },
  { href: "/(tabs)/history", title: "Trips", icon: "airplane" },
  { href: "/(tabs)/message", title: "Inbox", icon: "message.fill" },
  { href: "/(tabs)/account", title: "Profile", icon: "person.fill" },
] as const;

export default function RootLayout() {
  const colorScheme = (useColorScheme() ?? "light") as "light" | "dark";
  const c = Colors[colorScheme];

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const showSidebar = isWeb && width >= BREAKPOINT_MD;

  return (
    <AuthProvider>
      <BookingProvider>
        <FavoritesProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          {showSidebar ? (
            <View style={[styles.shell, { backgroundColor: c.background }]}>
              <View
                style={[
                  styles.sidebar,
                  { borderRightColor: c.border, backgroundColor: c.background },
                ]}
              >
                <Sidebar c={c} />
              </View>
              <View style={styles.content}>
                <Slot />
              </View>
            </View>
          ) : (
            <Slot />
          )}
        </FavoritesProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

function Sidebar({ c }: { c: any }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Text style={[styles.brand, { color: c.primary }]}>Travel App</Text>

      {ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);

        return (
          <Pressable
            key={item.href}
            onPress={() => router.replace(item.href)}
            style={({ hovered, pressed }) => [
              styles.sideItem,
              active && { backgroundColor: c.card ?? "rgba(0,0,0,0.06)" },
              (hovered || pressed) && { opacity: 0.9 },
            ]}
          >
            <IconSymbol
              size={22}
              name={item.icon as any}
              color={active ? (c.tint ?? c.primary) : c.icon}
            />
            <Text
              style={[
                styles.sideText,
                { color: active ? (c.tint ?? c.primary) : c.text },
              ]}
            >
              {item.title}
            </Text>
          </Pressable>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, flexDirection: "row" },
  sidebar: { width: 260, paddingHorizontal: 14, paddingTop: 16, borderRightWidth: 1 },
  brand: { fontSize: 18, fontWeight: "700", marginBottom: 14, paddingHorizontal: 8 },
  sideItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  sideText: { fontSize: 15, fontWeight: "600" },
  content: { flex: 1 },
});
