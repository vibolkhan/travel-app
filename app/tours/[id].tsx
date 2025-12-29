import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "../../components/IconSymbol";
import { BackButton } from "../../components/ui/BackButton";
import { Button } from "../../components/ui/Button";
import { RatingStars } from "../../components/ui/RatingStars";
import { useFavorites } from "../../context/FavoritesContext";
import { useThemeColors } from "../../hooks/useThemeColors";
import { Tour } from "../../types/models";
import { fetchTourById } from "../../utils/api";

export default function TourDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    loadTour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTour = async () => {
    try {
      setLoading(true);
      const data = await fetchTourById(id);
      setTour(data);
    } catch (error) {
      console.error("Failed to load tour:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!tour) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Tour not found</Text>
      </View>
    );
  }

  const isFav = isFavorite(tour.id, "tour");
  const toggleFavorite = () => {
    isFav ? removeFavorite(tour.id, "tour") : addFavorite(tour.id, "tour");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: tour.name,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => <BackButton fallbackHref="/tours" />,
          headerRight: () => (
            <IconSymbol
              name={isFav ? "heart.fill" : "heart"}
              size={24}
              color={isFav ? colors.error : colors.primary}
              style={{ marginRight: 16 }}
              onPress={toggleFavorite}
            />
          ),
        }}
      />

      {/* Overlay back button if you still want it */}
      <View style={{ position: "absolute", top: insets.top + 8, left: 8, zIndex: 20 }}>
        <BackButton fallbackHref="/tours" />
      </View>

      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        <Image source={typeof tour.image === "string" ? { uri: tour.image } : (tour.image as any)} style={styles.image} />

        {/* ✅ card surface */}
        <View style={[styles.content, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
              {tour.name}
            </Text>
            <RatingStars rating={tour.rating} />
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <IconSymbol name="clock.fill" size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.subtext }]}>{tour.duration}</Text>
            </View>

            <View style={styles.infoItem}>
              <IconSymbol name="person.2.fill" size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.subtext }]}>Max {tour.groupSize}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.subtext }]}>{tour.description}</Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Itinerary</Text>
          <View style={styles.timeline}>
            {tour.itinerary.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.dayTitle, { color: colors.text }]}>
                    Day {item.day}: {item.title}
                  </Text>
                  <Text style={[styles.dayDesc, { color: colors.subtext }]}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>What&apos;s Included</Text>
          <View style={styles.includedList}>
            {tour.included.map((item, index) => (
              <View key={index} style={styles.includedItem}>
                <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                <Text style={[styles.includedText, { color: colors.text }]}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.reviewsPreview}>
            <View style={styles.reviewHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
              <Text
                style={[styles.seeAll, { color: colors.primary }]}
                onPress={() => router.push({ pathname: "/reviews", params: { targetId: tour.id } })}
              >
                See All
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ✅ footer surface */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.subtext }]}>Total Price</Text>
          <Text style={[styles.price, { color: colors.primary }]}>${tour.price}</Text>
        </View>

        <Button
          title="Book Tour"
          onPress={() =>
            router.push({
              pathname: "/booking/dates",
              params: { type: "Tour", targetId: tour.id },
            })
          }
          style={styles.bookBtn}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: 250, resizeMode: "cover" },

  content: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  name: { fontSize: 24, fontWeight: "bold", flex: 1 },

  infoRow: { flexDirection: "row", marginBottom: 24, flexWrap: "wrap" },
  infoItem: { flexDirection: "row", alignItems: "center", marginRight: 24, marginBottom: 8 },
  infoText: { fontSize: 16, marginLeft: 8 },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, marginTop: 8 },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 24 },

  timeline: { marginLeft: 8, marginBottom: 24 },
  timelineItem: { flexDirection: "row", marginBottom: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 6, marginRight: 16 },
  timelineContent: { flex: 1 },
  dayTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  dayDesc: { fontSize: 14 },

  includedList: { marginBottom: 24 },
  includedItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  includedText: { fontSize: 14, marginLeft: 8 },

  reviewsPreview: { marginBottom: 20 },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  seeAll: { fontWeight: "600" },

  footer: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: { fontSize: 12 },
  price: { fontSize: 24, fontWeight: "bold" },
  bookBtn: { width: 150 },
});
