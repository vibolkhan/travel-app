import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Hotel } from '../../types/models';
import { IconSymbol } from '../IconSymbol';
import { RatingStars } from '../ui/RatingStars';

interface HotelCardProps {
    hotel: Hotel;
    onPress: () => void;
}

export function HotelCard({ hotel, onPress }: HotelCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
            <Image
                source={typeof hotel.image === 'string' ? { uri: hotel.image } : hotel.image}
                style={styles.image}
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name}>{hotel.name}</Text>
                    <RatingStars rating={hotel.rating} />
                </View>
                <View style={styles.locationRow}>
                    <IconSymbol name="mappin.and.ellipse" size={14} color="#666" />
                    <Text style={styles.location}>{hotel.location}</Text>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.price}>${hotel.pricePerNight}<Text style={styles.perNight}>/night</Text></Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{hotel.reviews} reviews</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height: 100,
    },
    image: {
        width: 100,
        height: '100%',
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0a7ea4',
    },
    perNight: {
        fontSize: 12,
        fontWeight: '400',
        color: '#666',
    },
    badge: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 12,
        color: '#666',
    }
});
