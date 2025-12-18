import { Image, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Room } from '../../types/models';
import { IconSymbol } from '../IconSymbol';
import { Button } from '../ui/Button';

interface RoomCardProps {
    room: Room;
    onSelect: () => void;
}

export function RoomCard({ room, onSelect }: RoomCardProps) {
    const colors = useThemeColors();
    const mainImage = room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427';

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.card, borderColor: colors.border },
                !room.isAvailable && styles.disabledContainer,
            ]}
        >
            <Image
                source={typeof mainImage === 'string' ? { uri: mainImage } : mainImage}
                style={[styles.image, !room.isAvailable && styles.grayscale]}
            />
            {!room.isAvailable && (
                <View style={styles.unavailableBadge}>
                    <Text style={[styles.unavailableText, { color: colors.text }]}>UNAVAILABLE</Text>
                </View>
            )}
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={[styles.name, { color: colors.text }]}>{room.roomType} Room</Text>
                    <Text style={[styles.roomNumber, { color: colors.primary, backgroundColor: colors.background, borderColor: colors.border }]}>
                        #{room.roomNumber}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <IconSymbol name="person.2.fill" size={16} color={colors.subtext} />
                    <Text style={[styles.infoText, { color: colors.subtext }]}>{room.capacity} Guests</Text>

                    {room.floor !== null && room.floor !== undefined && (
                        <>
                            <View style={[styles.dot, { backgroundColor: colors.border }]} />
                            <IconSymbol name="layers" size={16} color={colors.subtext} />
                            <Text style={[styles.infoText, { color: colors.subtext }]}>Floor {room.floor}</Text>
                        </>
                    )}
                </View>

                {room.description && (
                    <Text style={[styles.description, { color: colors.subtext }]} numberOfLines={2}>
                        {room.description}
                    </Text>
                )}

                <View style={styles.amenities}>
                    {(room.amenities || []).slice(0, 4).map((amenity, index) => (
                        <View key={index} style={[styles.amenityBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <Text style={[styles.amenityText, { color: colors.subtext }]}>{amenity}</Text>
                        </View>
                    ))}
                </View>

                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <View>
                        <Text style={[styles.price, { color: colors.primary }]}>
                            ${room.pricePerNight}
                            <Text style={[styles.perNight, { color: colors.subtext }]}>/night</Text>
                        </Text>
                    </View>
                    <Button
                        title={room.isAvailable ? "Select Room" : "Sold Out"}
                        onPress={onSelect}
                        style={styles.button}
                        disabled={!room.isAvailable}
                        variant={room.isAvailable ? "primary" : "outline"}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        // shadowColor will be applied via inline style
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    disabledContainer: {
        opacity: 0.8,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    grayscale: {
        opacity: 0.6,
    },
    unavailableBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    unavailableText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    content: {
        padding: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
    },
    roomNumber: {
        fontSize: 14,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        marginLeft: 6,
        marginRight: 10,
    },
    dot: {
        width: 4, height: 4,
        borderRadius: 2,
        marginRight: 10,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    amenities: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        gap: 8,
    },
    amenityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    amenityText: {
        fontSize: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: 16,
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
    },
    perNight: {
        fontSize: 14,
        fontWeight: '400',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    }
});
