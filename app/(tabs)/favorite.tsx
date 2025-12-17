import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DestinationCard } from '../../components/cards/DestinationCard';
import { HotelCard } from '../../components/cards/HotelCard';
import { TourCard } from '../../components/cards/TourCard';
import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/EmptyState';
import { useFavorites } from '../../context/FavoritesContext';
import { destinations } from '../../data/destinations';
import { hotels } from '../../data/hotels';
import { tours } from '../../data/tours';

const TABS = ['Destinations', 'Hotels', 'Tours'];

export default function FavoriteScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Destinations');
    const { favorites } = useFavorites();

    const renderContent = () => {
        if (activeTab === 'Destinations') {
            const favDestinations = destinations.filter(d => favorites.some(f => f.id === d.id && f.type === 'destination'));
            if (favDestinations.length === 0) return <EmptyState title="No Favorites" message="You haven't saved any destinations yet." />;
            return (
                <FlatList
                    data={favDestinations}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <DestinationCard
                            destination={item}
                            width="100%"
                            onPress={() => router.push(`/explore/${item.id}`)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            );
        } else if (activeTab === 'Hotels') {
            const favHotels = hotels.filter(h => favorites.some(f => f.id === h.id && f.type === 'hotel'));
            if (favHotels.length === 0) return <EmptyState title="No Favorites" message="You haven't saved any hotels yet." icon="bed.double" />;
            return (
                <FlatList
                    data={favHotels}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <HotelCard
                            hotel={item}
                            onPress={() => router.push(`/hotels/${item.id}`)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            );
        } else {
            const favTours = tours.filter(t => favorites.some(f => f.id === t.id && f.type === 'tour'));
            if (favTours.length === 0) return <EmptyState title="No Favorites" message="You haven't saved any tours yet." icon="airplane" />;
            return (
                <FlatList
                    data={favTours}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TourCard
                            tour={item}
                            onPress={() => router.push(`/tours/${item.id}`)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            );
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={styles.title}>Favorites</Text>
            </View>
            <View style={styles.tabs}>
                {TABS.map(tab => (
                    <Chip
                        key={tab}
                        label={tab}
                        selected={activeTab === tab}
                        onPress={() => setActiveTab(tab)}
                    />
                ))}
            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    content: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    }
});
