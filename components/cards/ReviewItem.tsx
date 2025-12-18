import { Image, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { useAppColors } from '../../hooks/useAppColors';
import { Review } from '../../types/models';
import { RatingStars } from '../ui/RatingStars';

interface ReviewItemProps {
    review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
    const colors = useAppColors();
    return (
        <View style={[styles.container, { backgroundColor: colors.text, borderBottomColor: colors.card }]}>
            <View style={styles.header}>
                <Image
                    source={typeof review.authorAvatar === 'string' ? { uri: review.authorAvatar } : review.authorAvatar}
                    style={styles.avatar}
                />
                <View style={styles.headerText}>
                    <Text style={[styles.authorName, { color: colors.card }]}>{review.authorName}</Text>
                    <Text style={[styles.date, { color: colors.card }]}>{review.date}</Text>
                </View>
                <RatingStars rating={review.rating} showText={false} />
            </View>
            <Text style={[styles.text, { color: colors.card }]}>{review.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
    },
    date: {
        fontSize: 12,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
});
