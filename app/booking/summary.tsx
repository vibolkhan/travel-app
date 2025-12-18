import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '../../components/IconSymbol';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { useBooking } from '../../context/BookingContext';
import { Booking, Hotel, Room, Tour } from '../../types/models';
import { fetchHotelById, fetchRoomsByHotelId, fetchTourById } from '../../utils/api';
import { formatDate } from '../../utils/dates';

export default function BookingSummaryScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { type, targetId, detailId, checkIn, checkOut, guests, days } = params as any;
    const { addBooking } = useBooking();

    const [target, setTarget] = React.useState<Hotel | Tour | null>(null);
    const [room, setRoom] = React.useState<Room | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const isHotel = type === 'Hotel';

    React.useEffect(() => {
        loadData();
    }, [targetId, detailId]);

    const loadData = async () => {
        try {
            setLoading(true);
            if (isHotel) {
                const hotelData = await fetchHotelById(targetId);
                setTarget(hotelData);
                if (detailId) {
                    const hotelRooms = await fetchRoomsByHotelId(targetId);
                    const selectedRoom = hotelRooms.find(r => r.id === detailId);
                    setRoom(selectedRoom || null);
                }
            } else {
                const tourData = await fetchTourById(targetId);
                setTarget(tourData);
            }
        } catch (error) {
            console.error('Failed to load summary data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#0a7ea4" />
            </View>
        );
    }

    if (!target) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text>Details not found</Text>
            </View>
        );
    }

    const pricePerUnit = isHotel
        ? (room ? room.pricePerNight : (target as Hotel).pricePerNight)
        : (target as Tour).price;

    const quantity = isHotel ? (parseInt(days || '1')) : (parseInt(guests || '1'));
    const basePrice = (pricePerUnit || 0) * quantity;

    const taxes = Math.round(basePrice * 0.1);
    const fees = Math.round(basePrice * 0.05);
    const total = basePrice + taxes + fees;

    const handleConfirm = async () => {
        try {
            setIsSubmitting(true);
            const booking: Partial<Booking> = {
                type: type as 'Hotel' | 'Tour',
                targetId,
                checkIn,
                checkOut: isHotel ? checkOut : checkIn,
                totalPrice: total,
                details: isHotel ? { roomId: detailId, numGuests: parseInt(guests || '1') } : { numGuests: parseInt(guests || '1') }
            };

            await addBooking(booking);
            router.push('/booking/success');
        } catch (e: any) {
            console.error(e);
            alert(e.message || 'Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Confirm Booking',
                headerLeft: () => <BackButton />
            }} />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Main Product Card */}
                <View style={styles.card}>
                    <Image
                        source={typeof target.image === 'string' ? { uri: target.image } : target.image}
                        style={styles.image}
                    />
                    <View style={styles.cardInfo}>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.name}>{target.name}</Text>
                        <View style={styles.locationRow}>
                            <IconSymbol name={isHotel ? "mappin.and.ellipse" : "clock.fill"} size={14} color="#666" />
                            <Text style={styles.locationText}>
                                {isHotel ? (target as Hotel).location : (target as Tour).duration}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Booking Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Stay Details</Text>
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <View style={styles.iconCircle}>
                                <IconSymbol name="calendar" size={20} color="#0a7ea4" />
                            </View>
                            <View>
                                <Text style={styles.detailLabel}>{isHotel ? 'Check-in' : 'Date'}</Text>
                                <Text style={styles.detailValue}>{formatDate(checkIn)}</Text>
                            </View>
                        </View>
                        {isHotel && (
                            <View style={styles.detailItem}>
                                <View style={styles.iconCircle}>
                                    <IconSymbol name="calendar" size={20} color="#0a7ea4" />
                                </View>
                                <View>
                                    <Text style={styles.detailLabel}>Check-out</Text>
                                    <Text style={styles.detailValue}>{formatDate(checkOut)}</Text>
                                </View>
                            </View>
                        )}
                        <View style={styles.detailItem}>
                            <View style={styles.iconCircle}>
                                <IconSymbol name="person.2.fill" size={20} color="#0a7ea4" />
                            </View>
                            <View>
                                <Text style={styles.detailLabel}>Guests</Text>
                                <Text style={styles.detailValue}>{guests} People</Text>
                            </View>
                        </View>
                        {isHotel && room && (
                            <View style={[styles.detailItem, { width: '100%', marginTop: 12 }]}>
                                <View style={styles.iconCircle}>
                                    <IconSymbol name="bed.double.fill" size={20} color="#0a7ea4" />
                                </View>
                                <View>
                                    <Text style={styles.detailLabel}>Room Selected</Text>
                                    <Text style={styles.detailValue}>{room.roomType} (Floor {room.floor})</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Price Breakdown Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Summary</Text>
                    <View style={styles.priceContainer}>
                        <View style={styles.row}>
                            <Text style={styles.label}>
                                {isHotel ? `${pricePerUnit} x ${days} nights` : `${pricePerUnit} x ${guests} guests`}
                            </Text>
                            <Text style={styles.value}>${basePrice}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Service Fees</Text>
                            <Text style={styles.value}>${fees}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Taxes</Text>
                            <Text style={styles.value}>${taxes}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Price</Text>
                            <Text style={styles.totalValue}>${total}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Method Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.paymentCard}>
                        <View style={styles.paymentIcon}>
                            <IconSymbol name="creditcard" size={24} color="#0a7ea4" />
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={styles.cardType}>Visa ending in 4242</Text>
                            <Text style={styles.cardExpiry}>Expires 12/26</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={16} color="#ccc" />
                    </View>
                </View>

                {/* Secure Payment Footer */}
                <View style={styles.secureBadge}>
                    <IconSymbol name="lock.fill" size={12} color="#4bb543" />
                    <Text style={styles.secureText}>SECURE PROTOCOL ENABLED</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={isSubmitting ? "Processing..." : `Complete Booking • $${total}`}
                    onPress={handleConfirm}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    style={styles.payButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    typeBadge: {
        backgroundColor: '#f0faff',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 6,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#0a7ea4',
        letterSpacing: 0.5,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fcfcfc',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginBottom: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0faff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailLabel: {
        fontSize: 11,
        color: '#888',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    priceContainer: {
        backgroundColor: '#fcfcfc',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 15,
        color: '#666',
    },
    value: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0a7ea4',
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    paymentIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f0faff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    paymentInfo: {
        flex: 1,
    },
    cardType: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    cardExpiry: {
        fontSize: 13,
        color: '#888',
    },
    secureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    secureText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#4bb543',
        marginLeft: 4,
        letterSpacing: 1,
    },
    footer: {
        padding: 24,
        paddingBottom: 34,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    payButton: {
        borderRadius: 16,
        height: 56,
    }
});
