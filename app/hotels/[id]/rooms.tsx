import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ActivityIndicator } from 'react-native';
import { RoomCard } from '../../../components/cards/RoomCard';
import { Room } from '../../../types/models';
import { fetchRoomsByHotelId } from '../../../utils/api';

export default function RoomSelectionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [hotelRooms, setHotelRooms] = React.useState<Room[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadRooms();
    }, [id]);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const data = await fetchRoomsByHotelId(id);
            setHotelRooms(data);
        } catch (error) {
            console.error('Failed to load rooms:', error);
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

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Select Room' }} />
            <FlatList
                data={hotelRooms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <RoomCard
                        room={item}
                        onSelect={() => router.push({
                            pathname: '/booking/dates',
                            params: { type: 'Hotel', targetId: id, detailId: item.id }
                        })}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No rooms available at the moment.</Text>}
            />
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
    },
    listContent: {
        padding: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    }
});
