import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TourCard } from '../../components/cards/TourCard';
import { BackButton } from '../../components/ui/BackButton';
import { SearchBar } from '../../components/ui/SearchBar';
import { tours } from '../../data/tours';

export default function TourListScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTours = tours.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Find Adventure',
                headerShadowVisible: false,
                headerLeft: () => <BackButton fallbackHref="/explore" />
            }} />
            <View style={styles.searchContainer}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search tours..." />
            </View>
            <FlatList
                data={filteredTours}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TourCard
                        tour={item}
                        onPress={() => router.push(`/tours/${item.id}`)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No tours found.</Text>}
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
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    }
});
