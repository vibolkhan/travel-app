import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/EmptyState';
import { useBooking } from '../../context/BookingContext';
import { Booking } from '../../types/models';
import { formatDate } from '../../utils/dates';

import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

const TABS = ['pending', 'completed', 'cancelled'] as const;

export default function HistoryScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const [activeTab, setActiveTab] = useState<typeof TABS[number]>('pending');
    const { getBookingsByStatus, loading, refreshBookings } = useBooking();
    const bookings = getBookingsByStatus(activeTab);

    const renderBookingItem = ({ item }: { item: Booking }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            activeOpacity={0.9}
            onPress={() => router.push(`/booking/${item.id}`)}
        >
            <Image
                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                style={styles.image}
            />
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cardTitle, { color: themeColors.text }]}>{item.title}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: item.type === 'Hotel' ? (colorScheme === 'dark' ? '#1a237e' : '#e3f2fd') : (colorScheme === 'dark' ? '#4a148c' : '#f3e5f5') }]}>
                        <Text style={[styles.typeText, { color: item.type === 'Hotel' ? (colorScheme === 'dark' ? '#bbdefb' : '#1565c0') : (colorScheme === 'dark' ? '#e1bee7' : '#7b1fa2') }]}>{item.type}</Text>
                    </View>
                </View>
                <Text style={[styles.date, { color: themeColors.subtext }]}>{formatDate(item.checkIn)} {item.checkOut ? `- ${formatDate(item.checkOut)}` : ''}</Text>
                <View style={styles.footer}>
                    <Text style={[styles.price, { color: themeColors.text }]}>${item.totalPrice}</Text>
                    <Text style={[styles.status, { color: getStatusColor(item.status, colorScheme) }]}>{item.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const getStatusColor = (status: string, scheme: 'light' | 'dark') => {
        switch (status) {
            case 'pending': return themeColors.primary;
            case 'completed': return scheme === 'dark' ? '#4caf50' : 'green';
            case 'cancelled': return scheme === 'dark' ? '#f44336' : 'red';
            default: return themeColors.subtext;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={[styles.title, { color: themeColors.primary }]}>My Trips</Text>
            </View>
            <View style={styles.tabs}>
                {TABS.map(tab => (
                    <Chip
                        key={tab}
                        label={tab}
                        selected={activeTab === tab}
                        onPress={() => setActiveTab(tab)}
                    />
                ))}
            </View>

            <FlatList
                data={bookings}
                keyExtractor={item => item.id}
                renderItem={renderBookingItem}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={refreshBookings}
                ListEmptyComponent={<EmptyState title="No Trips" message={`You have no ${activeTab.toLowerCase()} trips.`} icon="airplane" />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    image: {
        width: 100,
        height: '100%',
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    bookingType: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        flex: 1,
        marginRight: 8,
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    price: {
        fontWeight: 'bold',
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start', // Ensure it doesn't stretch
        flexShrink: 0,
    },
    typeText: {
        fontSize: 10,
        fontWeight: 'bold',
    }
});
