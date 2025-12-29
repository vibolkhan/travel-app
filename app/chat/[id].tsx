import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../../components/IconSymbol';
import { useAppColors } from '../../hooks/useAppColors';

// --- Types ---
type Message = {
    id: string;
    text: string;
    isSender: boolean; // true if sent by the user, false if received
    time: string;
};

// --- Mock Data ---
// In a real app, you would fetch chat history based on the ID
const MOCK_HISTORY: Record<string, Message[]> = {
    'default': [
        { id: '1', text: 'Hi there!', isSender: false, time: '10:00 AM' },
        { id: '2', text: 'Hello! How can I help you?', isSender: true, time: '10:05 AM' },
        { id: '3', text: 'I wanted to ask about the itinerary.', isSender: false, time: '10:06 AM' },
    ]
};

export default function ChatDetailScreen() {
    const { id, name, avatar } = useLocalSearchParams<{ id: string; name: string; avatar: string }>();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(MOCK_HISTORY['default']);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const colors = useAppColors();

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isSender: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');

        // Simulate reply
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                text: "That sounds great! I'll check it out.",
                isSender: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, reply]);
        }, 1500);
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const renderItem = ({ item }: { item: Message }) => (
        <View style={[styles.messageBubbleContainer, item.isSender ? styles.senderContainer : styles.receiverContainer]}>
            {!item.isSender && (
                <Image
                    source={{ uri: avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
                    style={styles.messageAvatar}
                />
            )}
            <View style={[styles.messageBubble, item.isSender ? [styles.senderBubble, { backgroundColor: colors.primary }] : [styles.receiverBubble, { backgroundColor: colors.card }]]}>
                <Text style={[styles.messageText, { color: item.isSender ? '#fff' : colors.text }]}>
                    {item.text}
                </Text>
                <Text style={[styles.messageTime, { color: item.isSender ? 'rgba(255, 255, 255, 0.7)' : colors.subtext }]}>
                    {item.time}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={colors.primary} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Image
                        source={{ uri: avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
                        style={styles.headerAvatar}
                    />
                    <Text style={[styles.headerName, { color: colors.text }]}>{name || 'Chat'}</Text>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <IconSymbol name="phone.fill" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                    <TouchableOpacity style={styles.attachButton}>
                        <IconSymbol name="plus.circle" size={24} color={colors.primary} />
                    </TouchableOpacity>

                    <TextInput
                        style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                        placeholder="Type a message..."
                        placeholderTextColor={colors.subtext}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />

                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <IconSymbol name="arrow.up.circle.fill" size={32} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 4,
        marginRight: 10,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageBubbleContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    senderContainer: {
        justifyContent: 'flex-end',
    },
    receiverContainer: {
        justifyContent: 'flex-start',
    },
    messageAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    senderBubble: {
        borderBottomRightRadius: 4,
    },
    receiverBubble: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 4,
    },
    messageTime: {
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
    },
    attachButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 10,
        fontSize: 16,
    },
    sendButton: {
        padding: 4,
    },
});
