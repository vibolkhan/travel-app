import { StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { useAppColors } from '../../hooks/useAppColors';
import { IconSymbol } from '../IconSymbol';

interface RatingStarsProps {
    rating: number;
    showText?: boolean;
}

export function RatingStars({ rating, showText = true }: RatingStarsProps) {
    const colors = useAppColors();
    return (
        <View style={[styles.container, { backgroundColor: colors.text, borderColor: colors.card }]}> 
            <IconSymbol name="star.fill" size={16} color="#FFD700" />
            {showText && <Text style={[styles.text, { color: colors.card }]}>{rating.toFixed(1)}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    text: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600',
    },
});
