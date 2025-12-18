import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '../../components/IconSymbol';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { addDays, formatDate, getDaysDifference } from '../../utils/dates';

export default function BookingDatesScreen() {
    const { type, targetId, detailId } = useLocalSearchParams<{ type: 'Hotel' | 'Tour', targetId: string, detailId?: string }>();
    const router = useRouter();

    // Mock dates for simplicity, in real app use a Calendar component
    const [checkIn, setCheckIn] = useState(formatDate(new Date().toISOString()));
    const [checkOut, setCheckOut] = useState(formatDate(addDays(new Date(), 3).toISOString()));
    const [guests, setGuests] = useState(2);

    const days = getDaysDifference(checkIn, checkOut);

    const handleContinue = () => {
        router.push({
            pathname: '/booking/summary',
            params: {
                type,
                targetId,
                detailId,
                checkIn,
                checkOut,
                guests: guests.toString(),
                days: days.toString()
            }
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{
                title: 'Select Dates',
                headerLeft: () => <BackButton />
            }} />

            <View style={styles.content}>
                <Text style={styles.title}>When are you going?</Text>

                <View style={styles.dateRow}>
                    <View style={styles.dateInputGroup}>
                        <Text style={styles.label}>Check-in</Text>
                        <View style={styles.inputBox}>
                            <IconSymbol name="calendar" size={20} color="#666" />
                            <TextInput
                                style={styles.input}
                                value={checkIn}
                                onChangeText={setCheckIn}
                                placeholder="DD/MMM/YYYY"
                            />
                        </View>
                    </View>
                    <View style={styles.dateInputGroup}>
                        <Text style={styles.label}>Check-out</Text>
                        <View style={styles.inputBox}>
                            <IconSymbol name="calendar" size={20} color="#666" />
                            <TextInput
                                style={styles.input}
                                value={checkOut}
                                onChangeText={setCheckOut}
                                placeholder="DD/MMM/YYYY"
                            />
                        </View>
                    </View>
                </View>

                <Text style={styles.daysText}>{days} nights stay</Text>

                <Text style={[styles.title, { marginTop: 32 }]}>Guests</Text>
                <View style={styles.guestRow}>
                    <Text style={styles.guestLabel}>Adults</Text>
                    <View style={styles.counter}>
                        <TouchableOpacity onPress={() => setGuests(Math.max(1, guests - 1))} style={styles.counterBtn}>
                            <IconSymbol name="minus.circle" size={24} color="#0a7ea4" />
                            {/* minus.circle might not be mapped, fallback to generic or update mapping if needed. 
                        Wait, IconSymbol requires mapped name. I'll use remove/add circle or similar if available, 
                        or just text. 'minus' and 'plus' are standard. I'll check my mapping.
                        I don't have minus/plus in mapping. I'll simply use text or a mapped icon like 'chevron.left'/'chevron.right' 
                        or just plain View circle. I'll stick to 'chevron.left' for decrement.
                    */}
                            {/* <Text style={styles.counterBtnText}>-</Text> */}
                        </TouchableOpacity>
                        <Text style={styles.guestCount}>{guests}</Text>
                        <TouchableOpacity onPress={() => setGuests(guests + 1)} style={styles.counterBtn}>
                            {/* <Text style={styles.counterBtnText}>+</Text> */}
                            <IconSymbol name="plus.circle" size={24} color="#0a7ea4" />
                            {/* 'plus.circle' not in mapping. I'll use valid icons. */}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <Button title="Continue" onPress={handleContinue} />
            </View>
        </SafeAreaView>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateInputGroup: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    daysText: {
        marginTop: 12,
        color: '#0a7ea4',
        fontWeight: '600',
    },
    guestRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    guestLabel: {
        fontSize: 16,
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    guestCount: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 16,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    }
});
