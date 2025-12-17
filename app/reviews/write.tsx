import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '../../components/IconSymbol';
import { Button } from '../../components/ui/Button';
import { reviews } from '../../data/reviews'; // In real app, this would be invalid, but we are using mock data array as "store" for now in memory

export default function WriteReviewScreen() {
    const { targetId } = useLocalSearchParams<{ targetId: string }>();
    const router = useRouter();
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');

    const submitReview = () => {
        // In a real app, this would be an API call or Store action
        // We will just mock adding it to the list locally if possible, or just go back
        reviews.unshift({
            id: `new-${Date.now()}`,
            targetId: targetId!,
            authorName: 'You',
            authorAvatar: 'https://via.placeholder.com/150',
            rating,
            date: new Date().toISOString().split('T')[0],
            text
        });
        router.back();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Write Review' }} />

            <Text style={styles.label}>Rate your experience</Text>
            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <IconSymbol
                            name={star <= rating ? "star.fill" : "star"}
                            size={32}
                            color="#FFD700"
                            style={styles.star}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Share your thoughts</Text>
            <TextInput
                style={styles.input}
                multiline
                placeholder="Tell us about your trip..."
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
            />

            <Button title="Submit Review" onPress={submitReview} style={styles.submitBtn} disabled={!text} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    star: {
        marginRight: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 12,
        height: 150,
        marginBottom: 24,
        fontSize: 16,
    },
    submitBtn: {
        marginTop: 'auto',
    }
});
