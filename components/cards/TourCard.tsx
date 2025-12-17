import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Tour } from '../../types/models';
import { IconSymbol } from '../IconSymbol';
import { RatingStars } from '../ui/RatingStars';

interface TourCardProps {
    tour: Tour;
    onPress: () => void;
}

export function TourCard({ tour, onPress }: TourCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
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
                    <IconSymbol name="clock.fill" size={14} color="#666" />
                    <Text style={styles.infoText}>{tour.duration}</Text>
                    <View style={styles.dot} />
                    <IconSymbol name="person.2.fill" size={14} color="#666" />
                    <Text style={styles.infoText}>Max {tour.groupSize}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>{tour.description}</Text>
                <View style={styles.footer}>
                    <Text style={styles.price}>${tour.price}</Text>
                </View>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    content: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
        marginRight: 8,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ccc',
        marginRight: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    footer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
});
