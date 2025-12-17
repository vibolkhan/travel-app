// File: app/(tabs)/favorite.tsx

import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import { DestinationCard } from '../../components/cards/DestinationCard';
import { HotelCard } from '../../components/cards/HotelCard';
import { TourCard } from '../../components/cards/TourCard';
import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/EmptyState';
import { destinations } from '../../data/destinations';
import { hotels } from '../../data/hotels';
import { tours } from '../../data/tours';
import { useFavoritesStore } from '../../store/useFavoritesStore';

type Tab = 'Destinations' | 'Hotels' | 'Tours';
const tabs: Tab[] = ['Destinations', 'Hotels', 'Tours'];

export default function FavoriteTab() {
  const [tab, setTab] = useState<Tab>('Destinations');
  const fav = useFavoritesStore();

  const items = useMemo(() => {
    if (tab === 'Destinations') return destinations.filter((d) => fav.destinationIds.includes(d.id));
    if (tab === 'Hotels') return hotels.filter((h) => fav.hotelIds.includes(h.id));
    return tours.filter((t) => fav.tourIds.includes(t.id));
  }, [tab, fav.destinationIds, fav.hotelIds, fav.tourIds]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Favorites</Text>

        <View style={{ marginTop: 10 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={tabs}
            keyExtractor={(x) => x}
            renderItem={({ item }) => <Chip label={item} selected={item === tab} onPress={() => setTab(item)} />}
          />
        </View>

        {items.length === 0 ? (
          <View style={{ marginTop: 30 }}>
            <EmptyState
              icon="favorite-border"
              title="No favorites yet"
              subtitle="Save destinations, hotels, or tours by tapping the heart icon."
              ctaTitle="Explore"
              onCtaPress={() => router.push('/explore')}
            />
          </View>
        ) : tab === 'Destinations' ? (
          <FlatList
            style={{ marginTop: 14 }}
            data={items as any[]}
            keyExtractor={(x: any) => x.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
            renderItem={({ item }: any) => (
              <View style={{ flex: 1 }}>
                <DestinationCard item={item} onPress={() => router.push({ pathname: '/explore/[id]', params: { id: item.id } })} />
              </View>
            )}
          />
        ) : tab === 'Hotels' ? (
          <FlatList
            style={{ marginTop: 14 }}
            data={items as any[]}
            keyExtractor={(x: any) => x.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }: any) => <HotelCard item={item} onPress={() => router.push({ pathname: '/hotels/[id]', params: { id: item.id } })} />}
          />
        ) : (
          <FlatList
            style={{ marginTop: 14 }}
            data={items as any[]}
            keyExtractor={(x: any) => x.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }: any) => <TourCard item={item} onPress={() => router.push({ pathname: '/tours/[id]', params: { id: item.id } })} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
});
