import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '../../components/IconSymbol';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { useBooking } from '../../context/BookingContext';
import { formatDate } from '../../utils/dates';

export default function BookingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { bookings, cancelBooking, loading } = useBooking();

    const booking = bookings.find(b => b.id === id);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0a7ea4" />
                </View>
            </SafeAreaView>
        );
    }

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

    const handleCancel = async () => {
        console.log('Canceling booking:', booking.id);
        if (Platform.OS === 'web') {
            const confirmed = window.confirm("Are you sure you want to cancel this booking?");
            if (confirmed) {
                try {
                    await cancelBooking(booking.id);
                    router.back();
                } catch (e) {
                    console.error('Cancellation failed:', e);
                }
            }
            return;
        }

        Alert.alert(
            "Cancel Booking",
            "Are you sure you want to cancel this booking?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await cancelBooking(booking.id);
                            router.back();
                        } catch (e) {
                            console.error('Cancellation failed:', e);
                        }
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
                        <Text style={styles.value}>{formatDate(booking.checkIn)} {booking.checkOut ? `- ${formatDate(booking.checkOut)}` : ''}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Total Price</Text>
                    <Text style={[styles.value, styles.price]}>${booking.totalPrice}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Booking Details</Text>
                    <View style={styles.detailCard}>
                        <View style={styles.detailItem}>
                            <IconSymbol name="person.2.fill" size={18} color="#666" />
                            <Text style={styles.detailText}>
                                <Text style={styles.detailLabel}>Guests: </Text>
                                <Text style={styles.detailValue}>{booking.numGuests || booking.details?.numGuests || '1'} People</Text>
                            </Text>
                        </View>

                        {booking.type === 'Hotel' && (booking.details?.roomNumber) && (
                            <View style={styles.detailItem}>
                                <IconSymbol name="bed.double.fill" size={18} color="#666" />
                                <Text style={styles.detailText}>
                                    <Text style={styles.detailLabel}>Room: </Text>
                                    <Text style={styles.detailValue}>#{booking.details.roomNumber}</Text>
                                </Text>
                            </View>
                        )}

                        <View style={styles.detailItem}>
                            <IconSymbol name="creditcard" size={18} color="#666" />
                            <Text style={styles.detailText}>
                                <Text style={styles.detailLabel}>Total Paid: </Text>
                                <Text style={styles.detailValue}>${booking.totalPrice}</Text>
                            </Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {booking.status === 'pending' && (
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
        case 'pending': return '#e3f2fd'; // Light blue
        case 'completed': return '#e8f5e9'; // Light green
        case 'cancelled': return '#ffebee'; // Light red
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
    detailCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
    detailLabel: {
        color: '#666',
        fontWeight: '400',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    }
});
