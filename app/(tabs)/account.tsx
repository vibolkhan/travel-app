import { Pressable, ScrollView, Text, View } from "react-native";

import React from "react";

const items = [
  { title: "Personal Info", subtitle: "Name, email, phone" },
  { title: "Payment Methods", subtitle: "Cards and wallets" },
  { title: "My Bookings", subtitle: "Upcoming and past trips" },
  { title: "Favorites", subtitle: "Saved destinations and tours" },
  { title: "Settings", subtitle: "Language, notifications" },
  { title: "Help & Support", subtitle: "Contact us" },
];

export default function AccountScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Account</Text>

      <View
        style={{
          marginTop: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#E2E8F0",
          backgroundColor: "#FFFFFF",
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 999,
            backgroundColor: "#E8F0FF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "800", color: "#0B5FFF" }}>PJ</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Philip James</Text>
          <Text style={{ marginTop: 2, color: "#64748B" }}>philip@email.com</Text>
        </View>
      </View>

      <Text style={{ marginTop: 20, fontSize: 16, fontWeight: "700" }}>
        Menu
      </Text>

      {items.map((it) => (
        <Pressable
          key={it.title}
          onPress={() => {}}
          style={{
            marginTop: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            backgroundColor: "#FFFFFF",
            padding: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700" }}>{it.title}</Text>
          <Text style={{ marginTop: 4, color: "#64748B" }}>{it.subtitle}</Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() => {}}
        style={{
          marginTop: 20,
          height: 48,
          borderRadius: 12,
          backgroundColor: "#EF4444",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}
