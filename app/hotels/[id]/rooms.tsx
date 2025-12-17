import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { RoomCard } from '../../../components/cards/RoomCard';
import { rooms } from '../../../data/rooms';

export default function RoomSelectionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const hotelRooms = rooms.filter(r => r.hotelId === id);

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
    listContent: {
        padding: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    }
});
