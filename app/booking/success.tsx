import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '../../components/IconSymbol';
import { Button } from '../../components/ui/Button';

export default function BookingSuccessScreen() {
    const router = useRouter();

    const handleHome = () => {
        // Navigate back to Explore tab, clearing stack
        router.replace('/(tabs)/explore');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <IconSymbol name="checkmark.circle.fill" size={80} color="#0a7ea4" />
                </View>
                <Text style={styles.title}>Booking Confirmed!</Text>
                <Text style={styles.message}>
                    Your trip has been successfully booked. You can view details in your trips history.
                </Text>
            </View>
            <View style={styles.footer}>
                <Button title="Back to Home" onPress={handleHome} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    footer: {
        paddingBottom: 20,
    }
});
