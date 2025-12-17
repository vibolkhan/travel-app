import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useFavorites } from '@/context/FavoritesContext';
import { HotelCard } from '../../components/cards/HotelCard';
import { TourCard } from '../../components/cards/TourCard';
import { IconSymbol } from '../../components/IconSymbol';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { destinations } from '../../data/destinations';
import { hotels } from '../../data/hotels';
import { tours } from '../../data/tours';

export default function DestinationDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const destination = destinations.find((d) => d.id === id);
    const destinationHotels = hotels.filter((h) => h.destinationId === id);
    const destinationTours = tours.filter((t) => t.destinationId === id);

    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const isFav = destination ? isFavorite(destination.id, 'destination') : false;

    if (!destination) {
        return (
            <View style={styles.center}>
                <Text>Destination not found</Text>
            </View>
        );
    }

    const toggleFavorite = () => {
        if (isFav) {
            removeFavorite(destination.id, 'destination');
        } else {
            addFavorite(destination.id, 'destination');
        }
    };

    return (
        <>
            <Stack.Screen options={{
                title: destination.name,
                headerLeft: () => <BackButton />,
                headerRight: () => (
                    <IconSymbol
                        name={isFav ? "heart.fill" : "heart"}
                        size={24}
                        color={isFav ? "red" : "#007AFF"}
                        style={{ marginRight: 16 }}
                        onPress={toggleFavorite} // Note: This might need wrapping in TouchableOpacity depending on IconSymbol impl
                    />
                )
            }} />
            <ScrollView style={styles.container}>
                <Image
                    source={typeof destination.image === 'string' ? { uri: destination.image } : destination.image}
                    style={styles.image}
                />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{destination.name}</Text>
                        <View style={styles.ratingBox}>
                            <IconSymbol name="star.fill" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{destination.rating}</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <IconSymbol name="mappin.and.ellipse" size={16} color="#666" />
                        <Text style={styles.location}>{destination.location}</Text>
                    </View>

                    <Text style={styles.description}>{destination.description}</Text>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular Hotels</Text>
                        <Button title="See All" variant="outline" onPress={() => router.push('/hotels')} style={styles.seeAllBtn} />
                    </View>
                    {destinationHotels.length > 0 ? (
                        destinationHotels.map(hotel => (
                            <HotelCard
                                key={hotel.id}
                                hotel={hotel}
                                onPress={() => router.push(`/hotels/${hotel.id}`)}
                            />
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No hotels found in this area.</Text>
                    )}

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Top Tours</Text>
                        <Button title="See All" variant="outline" onPress={() => router.push('/tours')} style={styles.seeAllBtn} />
                    </View>
                    {destinationTours.length > 0 ? (
                        destinationTours.map(tour => (
                            <TourCard
                                key={tour.id}
                                tour={tour}
                                onPress={() => router.push(`/tours/${tour.id}`)}
                            />
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No tours found in this area.</Text>
                    )}

                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    content: {
        padding: 20,
        marginTop: -20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        marginLeft: 4,
        fontWeight: '600',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    location: {
        fontSize: 16,
        color: '#666',
        marginLeft: 6,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAllBtn: {
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#999',
        marginBottom: 16,
    }
});
