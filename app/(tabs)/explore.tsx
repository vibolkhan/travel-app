// File: app/(tabs)/explore.tsx

import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Category, Destination } from '../../types/models';

import { router } from 'expo-router';
import { DestinationCard } from '../../components/cards/DestinationCard';
import { Chip } from '../../components/ui/Chip';
import { SearchBar } from '../../components/ui/SearchBar';
import { DESTINATIONS } from '../../data/destinations';

const CATEGORIES: (Category | 'All')[] = ['All', 'Beach', 'Mountain', 'City', 'Culture'];

export default function ExploreTab() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DESTINATIONS.filter((d) => {
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q);
      const matchC = category === 'All' || d.category === category;
      return matchQ && matchC;
    });
  }, [query, category]);

  const featured = filtered.slice(0, 3);
  const grid = filtered;

  const openDetail = (item: Destination) => {
    router.push({ pathname: '/explore/[id]', params: { id: item.id } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Discover your next trip</Text>
      <Text style={styles.sub}>Search destinations, save favorites, and book in a few taps.</Text>

      <View style={{ marginTop: 14 }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search destinations…" />
      </View>

      <View style={{ marginTop: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={c === category} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <FlatList
          data={featured}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.id}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <View style={{ width: 260 }}>
              <DestinationCard item={item} onPress={() => openDetail(item)} />
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All destinations</Text>

        <View style={styles.grid}>
          {grid.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <DestinationCard item={item} onPress={() => openDetail(item)} />
            </View>
          ))}
        </View>

        {grid.length === 0 ? (
          <View style={{ paddingVertical: 16 }}>
            <Text style={{ color: '#6B7280', fontWeight: '700' }}>
              No results. Try a different keyword or category.
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 28, backgroundColor: '#FFFFFF' },
  h1: { fontSize: 22, fontWeight: '900', color: '#111827' },
  sub: { marginTop: 6, fontSize: 14, lineHeight: 20, color: '#6B7280', fontWeight: '600' },
  section: { marginTop: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: 12 },
});
