import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '../../components/IconSymbol';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { RatingStars } from '../../components/ui/RatingStars';
import { useFavorites } from '../../context/FavoritesContext';
import { tours } from '../../data/tours';

export default function TourDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const tour = tours.find(t => t.id === id);
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();

    if (!tour) return <View style={styles.center}><Text>Tour not found</Text></View>;

    const isFav = isFavorite(tour.id, 'tour');
    const toggleFavorite = () => {
        isFav ? removeFavorite(tour.id, 'tour') : addFavorite(tour.id, 'tour');
    };

    return (
        <>
            <Stack.Screen options={{
                title: tour.name,
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
                    source={typeof tour.image === 'string' ? { uri: tour.image } : tour.image}
                    style={styles.image}
                />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{tour.name}</Text>
                        <RatingStars rating={tour.rating} />
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <IconSymbol name="clock.fill" size={16} color="#0a7ea4" />
                            <Text style={styles.infoText}>{tour.duration}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <IconSymbol name="person.2.fill" size={16} color="#0a7ea4" />
                            <Text style={styles.infoText}>Max {tour.groupSize}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{tour.description}</Text>

                    <Text style={styles.sectionTitle}>Itinerary</Text>
                    <View style={styles.timeline}>
                        {tour.itinerary.map((item, index) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineDot} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.dayTitle}>Day {item.day}: {item.title}</Text>
                                    <Text style={styles.dayDesc}>{item.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>What&apos;s Included</Text>
                    <View style={styles.includedList}>
                        {tour.included.map((item, index) => (
                            <View key={index} style={styles.includedItem}>
                                <IconSymbol name="checkmark.circle.fill" size={16} color="green" />
                                <Text style={styles.includedText}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.reviewsPreview}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.sectionTitle}>Reviews</Text>
                            <Text style={styles.seeAll} onPress={() => router.push({ pathname: '/reviews', params: { targetId: tour.id } })}>See All</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceLabel}>Total Price</Text>
                    <Text style={styles.price}>${tour.price}</Text>
                </View>
                <Button
                    title="Book Tour"
                    onPress={() => router.push({
                        pathname: '/booking/dates',
                        params: { type: 'Tour', targetId: tour.id }
                    })}
                    style={styles.bookBtn}
                />
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
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 8,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        marginBottom: 24,
    },
    timeline: {
        marginLeft: 8,
        marginBottom: 24,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0a7ea4',
        marginTop: 6,
        marginRight: 16,
    },
    timelineContent: {
        flex: 1,
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    dayDesc: {
        fontSize: 14,
        color: '#666',
    },
    includedList: {
        marginBottom: 24,
    },
    includedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    includedText: {
        fontSize: 14,
        marginLeft: 8,
        color: '#444',
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    bookBtn: {
        width: 150,
    }
});
