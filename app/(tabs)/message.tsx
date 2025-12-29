import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../../components/IconSymbol';
import { EmptyState } from '../../components/ui/EmptyState';
import { Colors } from '../../constants/Colors';

// --- Types ---
type Message = {
    id: string;
    sender: {
        name: string;
        avatar: string;
    };
    content: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
};

// --- Mock Data ---
const MOCK_MESSAGES: Message[] = [
    {
        id: '1',
        sender: { name: 'Jessica Smith', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
        content: 'Hey! Are we still on for the trip this weekend? I need to book the tickets.',
        time: '10:30 AM',
        unreadCount: 2,
        isOnline: true,
    },
    {
        id: '2',
        sender: { name: 'Mike Ross', avatar: 'https://randomuser.me/api/portraits/men/86.jpg' },
        content: 'I sent you the documents you requested. Let me know if you need anything else.',
        time: 'Yesterday',
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: '3',
        sender: { name: 'Sarah Connor', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
        content: 'Can you call me back when you get a chance?',
        time: 'Yesterday',
        unreadCount: 1,
        isOnline: true,
    },
    {
        id: '4',
        sender: { name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
        content: 'Great, thanks! See you then.',
        time: 'Tue',
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: '5',
        sender: { name: 'Emma Wilson', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
        content: 'The photos turned out amazing! I will share the link with you shortly.',
        time: 'Mon',
        unreadCount: 0,
        isOnline: true,
    },
    {
        id: '6',
        sender: { name: 'Hotel California', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg' },
        content: 'Your booking has been confirmed for Dec 25th - Dec 30th.',
        time: 'Sun',
        unreadCount: 0,
        isOnline: false,
    },
];

export default function MessageScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [messages, setMessages] = useState(MOCK_MESSAGES);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Simulate network request
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    const filteredMessages = messages.filter(msg =>
        msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const router = useRouter(); // You might need to add import { useRouter } from 'expo-router'; at the top if not present

    const handlePressMessage = (id: string) => {
        const message = messages.find(m => m.id === id);
        if (message) {
            router.push({
                pathname: '/chat/[id]',
                params: {
                    id: message.id,
                    name: message.sender.name,
                    avatar: message.sender.avatar
                }
            });
        }
    };

    const renderItem = ({ item }: { item: Message }) => (
        <TouchableOpacity
            style={[styles.messageItem, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}
            onPress={() => handlePressMessage(item.id)}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.sender.avatar }} style={styles.avatar} />
                {item.isOnline && <View style={[styles.onlineBadge, { backgroundColor: '#4CAF50', borderColor: themeColors.background }]} />}
            </View>

            <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                    <Text style={[styles.senderName, { color: themeColors.text }]} numberOfLines={1}>{item.sender.name}</Text>
                    <Text style={[styles.timeText, { color: themeColors.subtext }]}>{item.time}</Text>
                </View>

                <View style={styles.messageFooter}>
                    <Text
                        style={[
                            styles.messagePreview,
                            { color: themeColors.subtext },
                            item.unreadCount > 0 && [styles.unreadPreview, { color: themeColors.text }],
                        ]}
                        numberOfLines={1}
                    >
                        {item.content}
                    </Text>
                    {item.unreadCount > 0 && (
                        <View style={[styles.unreadBadge, { backgroundColor: themeColors.primary }]}>
                            <Text style={styles.unreadText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Text style={[styles.title, { color: themeColors.text }]}>Inbox</Text>
                <TouchableOpacity style={styles.moreBtn}>
                    <IconSymbol name="ellipsis.circle" size={24} color={themeColors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                    <IconSymbol name="magnifyingglass" size={18} color={themeColors.subtext} />
                    <TextInput
                        style={[styles.searchInput, { color: themeColors.text }]}
                        placeholder="Search messages..."
                        placeholderTextColor={themeColors.subtext}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredMessages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColors.primary} />
                }
                ListEmptyComponent={<EmptyState title="No messages found" message="" />}
            />

            <TouchableOpacity style={[styles.fab, { backgroundColor: themeColors.primary, shadowColor: themeColors.border }]}>
                <IconSymbol name="square.and.pencil" size={24} color="#fff" />
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    moreBtn: {
        padding: 5,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    listContent: {
        paddingBottom: 100, // Space for FAB
    },
    messageItem: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 15,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#eee',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
    },
    messageContent: {
        flex: 1,
        justifyContent: 'center',
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    senderName: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    timeText: {
        fontSize: 12,
    },
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messagePreview: {
        fontSize: 14,
        color: '#888',
        flex: 1,
        marginRight: 10,
    },
    unreadPreview: {
        color: '#333',
        fontWeight: '500',
    },
    unreadBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
});
