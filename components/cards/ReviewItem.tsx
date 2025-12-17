import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Review } from '../../types/models';
import { RatingStars } from '../ui/RatingStars';

interface ReviewItemProps {
    review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={typeof review.authorAvatar === 'string' ? { uri: review.authorAvatar } : review.authorAvatar}
                    style={styles.avatar}
                />
                <View style={styles.headerText}>
                    <Text style={styles.authorName}>{review.authorName}</Text>
                    <Text style={styles.date}>{review.date}</Text>
                </View>
                <RatingStars rating={review.rating} showText={false} />
            </View>
            <Text style={styles.text}>{review.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
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
        color: '#999',
    },
    text: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
});
