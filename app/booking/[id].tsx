import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '../../components/IconSymbol';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { useBooking } from '../../context/BookingContext';

export default function BookingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { bookings, cancelBooking } = useBooking();

    const booking = bookings.find(b => b.id === id);

    if (!booking) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{
                    headerShown: true,
                    title: 'Booking Details',
                    headerLeft: () => <BackButton fallbackHref="/(tabs)/history" />
                }} />
                <View style={styles.center}>
                    <Text>Booking not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleCancel = () => {
        Alert.alert(
            "Cancel Booking",
            "Are you sure you want to cancel this booking?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: () => {
                        cancelBooking(booking.id);
                        router.back();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Booking Details',
                headerShadowVisible: false,
                headerLeft: () => <BackButton />
            }} />

            <ScrollView style={styles.content}>
                <Image source={typeof booking.image === 'string' ? { uri: booking.image } : booking.image} style={styles.image} />

                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <View style={[styles.typeBadge, { backgroundColor: booking.type === 'Hotel' ? '#e3f2fd' : '#f3e5f5', marginRight: 8 }]}>
                                <Text style={[styles.typeText, { color: booking.type === 'Hotel' ? '#1565c0' : '#7b1fa2' }]}>{booking.type}</Text>
                            </View>
                            <Text style={styles.title}>{booking.title}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                        <Text style={styles.statusText}>{booking.status}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Dates</Text>
                    <View style={styles.row}>
                        <IconSymbol name="calendar" size={20} color="#666" />
                        <Text style={styles.value}>{booking.startDate} {booking.endDate ? `- ${booking.endDate}` : ''}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Total Price</Text>
                    <Text style={[styles.value, styles.price]}>${booking.totalPrice}</Text>
                </View>

                {booking.details && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Details</Text>
                        {Object.entries(booking.details).map(([key, value]) => (
                            <View key={key} style={styles.detailRow}>
                                <Text style={styles.detailKey}>{key}: </Text>
                                <Text style={styles.detailValue}>{String(value)}</Text>
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>

            {booking.status === 'Upcoming' && (
                <View style={styles.footer}>
                    <Button
                        title="Cancel Booking"
                        onPress={handleCancel}
                        style={{ backgroundColor: '#ff4444' }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Upcoming': return '#e3f2fd'; // Light blue
        case 'Completed': return '#e8f5e9'; // Light green
        case 'Cancelled': return '#ffebee'; // Light red
        default: return '#f5f5f5';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flexShrink: 1, // Allow text to wrap if needed
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333', // Dark text for contrast on light bg
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        fontSize: 16,
        marginLeft: 8,
        fontWeight: '500',
    },
    price: {
        color: '#0a7ea4',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 0,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailKey: {
        fontSize: 16,
        textTransform: 'capitalize',
        color: '#666',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    }
});
