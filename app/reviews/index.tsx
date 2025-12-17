import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ReviewItem } from '../../components/cards/ReviewItem';
import { Button } from '../../components/ui/Button';
import { reviews } from '../../data/reviews';

export default function ReviewsScreen() {
    const { targetId } = useLocalSearchParams<{ targetId: string }>();
    const router = useRouter();

    const filteredReviews = reviews.filter(r => r.targetId === targetId);
    const averageRating = filteredReviews.length > 0
        ? (filteredReviews.reduce((acc, r) => acc + r.rating, 0) / filteredReviews.length).toFixed(1)
        : 'New';

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Reviews' }} />
            <View style={styles.header}>
                <View>
                    <Text style={styles.rating}>{averageRating}</Text>
                    <Text style={styles.count}>{filteredReviews.length} reviews</Text>
                </View>
                <Button title="Write Review" onPress={() => router.push({ pathname: '/reviews/write', params: { targetId } })} style={styles.btn} />
            </View>

            <FlatList
                data={filteredReviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ReviewItem review={item} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No reviews yet. Be the first!</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    rating: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    count: {
        fontSize: 14,
        color: '#666',
    },
    btn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    listContent: {
        padding: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    }
});
