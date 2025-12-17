import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { useBooking } from '../../context/BookingContext';
import { hotels } from '../../data/hotels';
import { rooms } from '../../data/rooms';
import { tours } from '../../data/tours';
import { Booking } from '../../types/models';

export default function BookingSummaryScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { type, targetId, detailId, startDate, endDate, guests, days } = params as any;
    const { addBooking } = useBooking();

    const isHotel = type === 'Hotel';
    const target = isHotel
        ? hotels.find(h => h.id === targetId)
        : tours.find(t => t.id === targetId);

    // If hotel, get room
    const room = isHotel && detailId ? rooms.find(r => r.id === detailId) : null;

    if (!target) return null;

    const pricePerUnit = isHotel && room ? room.price : (target as any).price;
    const quantity = isHotel ? parseInt(days) : 1; // Days for hotel, 1 tour for tour (usually people count * price)
    // Assuming tour price is per person
    const basePrice = isHotel
        ? pricePerUnit * parseInt(days)
        : pricePerUnit * parseInt(guests);

    const taxes = Math.round(basePrice * 0.1);
    const fees = Math.round(basePrice * 0.05);
    const total = basePrice + taxes + fees;

    const handleConfirm = () => {
        const booking: Booking = {
            id: `bk-${Date.now()}`,
            userId: 'u1',
            type: type as 'Hotel' | 'Tour',
            targetId,
            title: target.name,
            image: target.image,
            startDate,
            endDate: isHotel ? endDate : startDate, // Tour ends same day or calculated
            status: (() => {
                const targetDate = new Date(isHotel ? endDate : startDate);
                const now = new Date();
                // Reset time part to compare just dates
                now.setHours(0, 0, 0, 0);
                // Adjust targetDate to handle timezone potential issues if it parsed as UTC
                // Simple string comparison might be safer if formats are consistent, but let's stick to date objects logic
                // If targetDate is YYYY-MM-DD, new Date() might be UTC.
                // Let's manually parse to ensure local time 
                const [y, m, d] = (isHotel ? endDate : startDate).split('-').map(Number);
                const localTarget = new Date(y, m - 1, d);

                return localTarget < now ? 'Completed' : 'Upcoming';
            })(),
            totalPrice: total,
            details: isHotel ? { room: room?.name, guests } : { guests, duration: (target as any).duration }
        };

        addBooking(booking);
        router.push('/booking/success');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Summary',
                headerLeft: () => <BackButton />
            }} />
            <ScrollView style={styles.content}>
                <View style={styles.card}>
                    <Image
                        source={typeof target.image === 'string' ? { uri: target.image } : target.image}
                        style={styles.image}
                    />
                    <View style={styles.cardInfo}>
                        <Text style={styles.name}>{target.name}</Text>
                        <Text style={styles.subtitle}>
                            {isHotel && room ? `${room.name} • ` : ''}
                            {startDate} {isHotel ? `to ${endDate}` : ''}
                        </Text>
                        <Text style={styles.subtitle}>{guests} Guests</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Price Breakdown</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Base Price</Text>
                    <Text style={styles.value}>${basePrice}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Taxes (10%)</Text>
                    <Text style={styles.value}>${taxes}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Fees (5%)</Text>
                    <Text style={styles.value}>${fees}</Text>
                </View>
                <View style={[styles.row, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${total}</Text>
                </View>

                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.paymentMethod}>
                    <Text>💳 Visa ending in 4242</Text>
                </View>

            </ScrollView>
            <View style={styles.footer}>
                <Button title={`Pay $${total}`} onPress={handleConfirm} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        flex: 1,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 12,
        marginBottom: 24,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: '#444',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    paymentMethod: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 32,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    }
});
