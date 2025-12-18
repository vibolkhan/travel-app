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
import { Destination, Hotel, Tour } from '../../types/models';
import { fetchDestinations, fetchHotels, fetchTours } from '../../utils/api';

import { ActivityIndicator } from 'react-native';

const TABS = ['Destinations', 'Hotels', 'Tours'];

export default function FavoriteScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Destinations');
    const { favorites } = useFavorites();

    const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
    const [allHotels, setAllHotels] = useState<Hotel[]>([]);
    const [allTours, setAllTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [destData, hotelsData, toursData] = await Promise.all([
                fetchDestinations(),
                fetchHotels(),
                fetchTours()
            ]);
            setAllDestinations(destData);
            setAllHotels(hotelsData);
            setAllTours(toursData);
        } catch (error) {
            console.error('Failed to load favorites data:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (activeTab === 'Destinations') {
            const favDestinations = allDestinations.filter(d => favorites.some(f => f.id === d.id && f.type === 'destination'));
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
            const favHotels = allHotels.filter(h => favorites.some(f => f.id === h.id && f.type === 'hotel'));
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
            const favTours = allTours.filter(t => favorites.some(f => f.id === t.id && f.type === 'tour'));
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
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#0a7ea4" />
                    </View>
                ) : (
                    renderContent()
                )}
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
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
