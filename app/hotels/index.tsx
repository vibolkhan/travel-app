// File: app/hotels/index.tsx

import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { HotelCard } from '../../components/cards/HotelCard';
import { destinations } from '../../data/destinations';
import { hotels } from '../../data/hotels';

export default function HotelsIndex() {
  const { destinationId } = useLocalSearchParams<{ destinationId?: string }>();

  const list = useMemo(() => {
    if (!destinationId) return hotels;
    return hotels.filter((h) => h.destinationId === destinationId);
  }, [destinationId]);

  const header = useMemo(() => {
    if (!destinationId) return 'Hotels';
    return destinations.find((d) => d.id === destinationId)?.name ?? 'Hotels';
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
          renderItem={({ item }) => <HotelCard item={item} onPress={() => router.push({ pathname: '/hotels/[id]', params: { id: item.id } })} />}
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
