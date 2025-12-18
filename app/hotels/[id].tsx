import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '../../components/IconSymbol';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { RatingStars } from '../../components/ui/RatingStars';
import { useFavorites } from '../../context/FavoritesContext';
import { rooms } from '../../data/rooms';
import { Hotel } from '../../types/models';
import { fetchHotelById } from '../../utils/api';

export default function HotelDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();

    useEffect(() => {
        loadHotel();
    }, [id]);

    const loadHotel = async () => {
        try {
            setLoading(true);
            const data = await fetchHotelById(id);
            setHotel(data);
        } catch (error) {
            console.error('Failed to load hotel:', error);
        } finally {
            setLoading(false);
        }
    };

    const hotelRooms = rooms.filter((r) => r.hotelId === id);

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#0a7ea4" /></View>;
    }

    if (!hotel) return <View style={styles.center}><Text>Hotel not found</Text></View>;

    const isFav = isFavorite(hotel.id, 'hotel');
    const toggleFavorite = () => {
        isFav ? removeFavorite(hotel.id, 'hotel') : addFavorite(hotel.id, 'hotel');
    };

    return (
        <>
            <Stack.Screen options={{
                title: hotel.name,
                headerLeft: () => <BackButton />,
                headerRight: () => (
                    <IconSymbol
                        name={isFav ? "heart.fill" : "heart"}
                        size={24}
                        color={isFav ? "red" : "#007AFF"}
                        style={{ marginRight: 16 }}
                        onPress={toggleFavorite}
                    />
                )
            }} />
            <ScrollView style={styles.container}>
                <Image
                    source={typeof hotel.image === 'string' ? { uri: hotel.image } : hotel.image}
                    style={styles.image}
                />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{hotel.name}</Text>
                        <RatingStars rating={hotel.rating} />
                    </View>
                    <View style={styles.locationRow}>
                        <IconSymbol name="mappin.and.ellipse" size={16} color="#666" />
                        <Text style={styles.location}>{hotel.location}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Amenities</Text>
                    <View style={styles.amenities}>
                        {hotel.amenities.map((amenity, index) => (
                            <View key={index} style={styles.amenityTag}>
                                <Text style={styles.amenityText}>{amenity}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{hotel.description}</Text>

                    <View style={styles.reviewsPreview}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.sectionTitle}>Reviews</Text>
                            <Text style={styles.seeAll} onPress={() => router.push({ pathname: '/reviews', params: { targetId: hotel.id } })}>See All</Text>
                        </View>
                        <View style={styles.ratingSummary}>
                            <Text style={styles.ratingParams}>{hotel.rating} / 5</Text>
                            <Text style={styles.reviewCount}>({hotel.reviews} reviews)</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceLabel}>Start from</Text>
                    <Text style={styles.price}>${hotel.pricePerNight}<Text style={styles.perNight}>/night</Text></Text>
                </View>
                <Button title="Select Details" onPress={() => router.push(`/hotels/${hotel.id}/rooms`)} style={styles.bookBtn} />
            </View>
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
        backgroundColor: '#fff',
        marginTop: -20,
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
        flex: 1,
        marginRight: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    location: {
        fontSize: 16,
        color: '#666',
        marginLeft: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    amenities: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    amenityTag: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    amenityText: {
        fontSize: 14,
        color: '#444',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        marginBottom: 24,
    },
    reviewsPreview: {
        marginBottom: 20,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    seeAll: {
        color: '#0a7ea4',
        fontWeight: '600',
    },
    ratingSummary: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    ratingParams: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    priceLabel: {
        fontSize: 12,
        color: '#666',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    perNight: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
    },
    bookBtn: {
        width: 150,
    }
});
