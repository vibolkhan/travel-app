import React from 'react';
import { DimensionValue, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Destination } from '../../types/models';
import { IconSymbol } from '../IconSymbol';
import { RatingStars } from '../ui/RatingStars';

interface DestinationCardProps {
    destination: Destination;
    onPress: () => void;
    width?: DimensionValue;
}

export function DestinationCard({ destination, onPress, width = 200 }: DestinationCardProps) {
    return (
        <TouchableOpacity
            style={[styles.container, { width } as any]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <Image
                source={typeof destination.image === 'string' ? { uri: destination.image } : destination.image}
                style={styles.image}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>{destination.name}</Text>
                    <RatingStars rating={destination.rating} showText={true} />
                </View>
                <View style={styles.locationRow}>
                    <IconSymbol name="mappin.and.ellipse" size={14} color="#666" />
                    <Text style={styles.location} numberOfLines={1}>{destination.location}</Text>
                </View>
                <Text style={styles.price}>${destination.pricePerDay}/day</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        // marginRight: 16, // Removed to fix alignment in vertical lists
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    content: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
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
        marginBottom: 8,
    },
    location: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0a7ea4',
    },
});
