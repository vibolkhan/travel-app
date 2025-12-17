import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Room } from '../../types/models';
import { IconSymbol } from '../IconSymbol';
import { Button } from '../ui/Button';

interface RoomCardProps {
    room: Room;
    onSelect: () => void;
}

export function RoomCard({ room, onSelect }: RoomCardProps) {
    return (
        <View style={styles.container}>
            <Image
                source={typeof room.image === 'string' ? { uri: room.image } : room.image}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.name}>{room.name}</Text>
                <View style={styles.infoRow}>
                    <IconSymbol name="person.2.fill" size={16} color="#666" />
                    <Text style={styles.infoText}>{room.capacity} Guests</Text>
                    <View style={styles.dot} />
                    <IconSymbol name="bed.double" size={16} color="#666" />
                    <Text style={styles.infoText}>{room.bedType}</Text>
                </View>
                <View style={styles.amenities}>
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                        <Text key={index} style={styles.amenity}>• {amenity}</Text>
                    ))}
                </View>
                <View style={styles.footer}>
                    <Text style={styles.price}>${room.price}<Text style={styles.perNight}>/night</Text></Text>
                    <Button title="Select" onPress={onSelect} style={styles.button} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    content: {
        padding: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
        marginRight: 8,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ccc',
        marginRight: 8,
    },
    amenities: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    amenity: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    perNight: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 20,
    }
});
