import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { useThemeColors } from "../../hooks/useThemeColors";
import { Tour } from "../../types/models";
import { IconSymbol } from "../IconSymbol";
import { RatingStars } from "../ui/RatingStars";

interface TourCardProps {
  tour: Tour;
  onPress: () => void;
}

export function TourCard({ tour, onPress }: TourCardProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          // Shadows look too heavy in dark mode, so use theme overlay
          shadowColor: colors.overlay,
        },
      ]}
    >
      <Image
        source={typeof tour.image === "string" ? { uri: tour.image } : (tour.image as any)}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {tour.name}
          </Text>
          <RatingStars rating={tour.rating} />
        </View>

        <View style={styles.infoRow}>
          <IconSymbol name="clock.fill" size={14} color={colors.subtext} />
          <Text style={[styles.infoText, { color: colors.subtext }]}>{tour.duration}</Text>

          <View style={[styles.dot, { backgroundColor: colors.border }]} />

          <IconSymbol name="person.2.fill" size={14} color={colors.subtext} />
          <Text style={[styles.infoText, { color: colors.subtext }]}>Max {tour.groupSize}</Text>
        </View>

        <Text style={[styles.description, { color: colors.subtext }]} numberOfLines={2}>
          {tour.description}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.primary }]}>${tour.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  infoText: {
    fontSize: 14,
    marginLeft: 4,
    marginRight: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
