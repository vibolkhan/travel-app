import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '../../components/IconSymbol';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { addDays, formatDate, getDaysDifference } from '../../utils/dates';

import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function BookingDatesScreen() {
    const { type, targetId, detailId } = useLocalSearchParams<{ type: 'Hotel' | 'Tour', targetId: string, detailId?: string }>();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

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
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
            <Stack.Screen options={{
                title: 'Select Dates',
                headerStyle: { backgroundColor: themeColors.background },
                headerTintColor: themeColors.text,
                headerLeft: () => <BackButton />
            }} />

            <View style={styles.content}>
                <Text style={[styles.title, { color: themeColors.text }]}>When are you going?</Text>

                <View style={styles.dateRow}>
                    <View style={styles.dateInputGroup}>
                        <Text style={[styles.label, { color: themeColors.subtext }]}>Check-in</Text>
                        <View style={[styles.inputBox, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}>
                            <IconSymbol name="calendar" size={20} color={themeColors.subtext} />
                            <TextInput
                                style={[styles.input, { color: themeColors.text }]}
                                value={checkIn}
                                onChangeText={setCheckIn}
                                placeholder="DD/MMM/YYYY"
                                placeholderTextColor={themeColors.subtext}
                            />
                        </View>
                    </View>
                    <View style={styles.dateInputGroup}>
                        <Text style={[styles.label, { color: themeColors.subtext }]}>Check-out</Text>
                        <View style={[styles.inputBox, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}>
                            <IconSymbol name="calendar" size={20} color={themeColors.subtext} />
                            <TextInput
                                style={[styles.input, { color: themeColors.text }]}
                                value={checkOut}
                                onChangeText={setCheckOut}
                                placeholder="DD/MMM/YYYY"
                                placeholderTextColor={themeColors.subtext}
                            />
                        </View>
                    </View>
                </View>

                <Text style={[styles.daysText, { color: themeColors.primary }]}>{days} nights stay</Text>

                <Text style={[styles.title, { marginTop: 32, color: themeColors.text }]}>Guests</Text>
                <View style={[styles.guestRow, { borderBottomColor: themeColors.border }]}>
                    <Text style={[styles.guestLabel, { color: themeColors.text }]}>Adults</Text>
                    <View style={styles.counter}>
                        <TouchableOpacity
                            onPress={() => setGuests(Math.max(1, guests - 1))}
                            style={[styles.counterBtn, { backgroundColor: themeColors.card }]}
                        >
                            <IconSymbol name="minus" size={20} color={themeColors.primary} />
                        </TouchableOpacity>
                        <Text style={[styles.guestCount, { color: themeColors.text }]}>{guests}</Text>
                        <TouchableOpacity
                            onPress={() => setGuests(guests + 1)}
                            style={[styles.counterBtn, { backgroundColor: themeColors.card }]}
                        >
                            <IconSymbol name="plus" size={20} color={themeColors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
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
