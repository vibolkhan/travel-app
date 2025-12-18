import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HotelCard } from '../../components/cards/HotelCard';
import { BackButton } from '../../components/ui/BackButton';
import { Chip } from '../../components/ui/Chip';
import { SearchBar } from '../../components/ui/SearchBar';
import { Hotel } from '../../types/models';
import { fetchHotels, fetchHotelsByDestinationId } from '../../utils/api';

export default function HotelListScreen() {
    const router = useRouter();

    const { destinationId, title } = useLocalSearchParams<{ destinationId?: string, title?: string }>();
    const [searchQuery, setSearchQuery] = useState('');
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const displayTitle = title || (destinationId ? 'Local Hotels' : 'Find Hotels');

    useEffect(() => {
        loadHotels();
    }, [destinationId]);

    const loadHotels = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = destinationId
                ? await fetchHotelsByDestinationId(destinationId)
                : await fetchHotels();
            setHotels(data);
        } catch (err) {
            setError('Failed to load hotels. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredHotels = hotels.filter((h) =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
                <Stack.Screen options={{
                    headerShown: true,
                    title: 'Find Hotels',
                    headerShadowVisible: false,
                    headerLeft: () => <BackButton fallbackHref="/explore" />
                }} />
                <ActivityIndicator size="large" color="#0a7ea4" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
                <Stack.Screen options={{
                    headerShown: true,
                    title: 'Find Hotels',
                    headerShadowVisible: false,
                    headerLeft: () => <BackButton fallbackHref="/explore" />
                }} />
                <Text style={styles.errorText}>{error}</Text>
                <Chip label="Retry" selected={true} onPress={loadHotels} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{
                headerShown: true,
                title: displayTitle,
                headerShadowVisible: false,
                headerLeft: () => <BackButton fallbackHref="/explore" />
            }} />
            <View style={styles.searchContainer}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search hotels..." />
            </View>
            <FlatList
                data={filteredHotels}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <HotelCard
                        hotel={item}
                        onPress={() => router.push(`/hotels/${item.id}`)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No hotels found.</Text>}
                refreshing={loading}
                onRefresh={loadHotels}
            />
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
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 20,
    }
});
