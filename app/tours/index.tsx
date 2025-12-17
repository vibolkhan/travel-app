// File: app/tours/index.tsx

import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { TourCard } from '../../components/cards/TourCard';
import { destinations } from '../../data/destinations';
import { tours } from '../../data/tours';

export default function ToursIndex() {
  const { destinationId } = useLocalSearchParams<{ destinationId?: string }>();

  const list = useMemo(() => {
    if (!destinationId) return tours;
    return tours.filter((t) => t.destinationId === destinationId);
  }, [destinationId]);

  const header = useMemo(() => {
    if (!destinationId) return 'Tours';
    return destinations.find((d) => d.id === destinationId)?.name ?? 'Tours';
  }, [destinationId]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>{header}</Text>

        <FlatList
          style={{ marginTop: 12 }}
          data={list}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => <TourCard item={item} onPress={() => router.push({ pathname: '/tours/[id]', params: { id: item.id } })} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
});
