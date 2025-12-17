import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '../IconSymbol';

interface RatingStarsProps {
    rating: number;
    showText?: boolean;
}

export function RatingStars({ rating, showText = true }: RatingStarsProps) {
    return (
        <View style={styles.container}>
            <IconSymbol name="star.fill" size={16} color="#FFD700" />
            {showText && <Text style={styles.text}>{rating.toFixed(1)}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    text: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
});
