import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DestinationCard } from '../../components/cards/DestinationCard';
import { Chip } from '../../components/ui/Chip';
import { SearchBar } from '../../components/ui/SearchBar';
import { destinations } from '../../data/destinations';

const CATEGORIES = ['All', 'Beach', 'Mountain', 'City', 'Culture'];

export default function ExploreScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredDestinations = destinations.filter((dest) => {
        const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
        const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dest.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Text style={styles.title}>Explore the</Text>
                <Text style={styles.subtitle}>Beautiful World!</Text>
            </View>

            <View style={styles.searchContainer}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search destinations..." />
            </View>

            <View style={styles.categories}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
                    {CATEGORIES.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            selected={selectedCategory === cat}
                            onPress={() => setSelectedCategory(cat)}
                        />
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredDestinations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <DestinationCard
                            destination={item}
                            width="100%"
                            onPress={() => router.push(`/explore/${item.id}`)}
                        />
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.emptyText}>No destinations found.</Text>}
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
        fontSize: 24,
        color: '#666',
    },
    subtitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0a7ea4',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    categories: {
        marginBottom: 10,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 80, // For tab bar
    },
    cardWrapper: {
        marginBottom: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    }
});
