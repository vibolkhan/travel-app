import { Stack } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol, IconSymbolName } from '../../components/IconSymbol';

export default function AccountScreen() {
    const user = {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    };

    const MENU_ITEMS: { icon: IconSymbolName; label: string }[] = [
        { icon: 'person', label: 'Personal Information' },
        { icon: 'creditcard', label: 'Payment Methods' }, // creditcard might not be in mapping, using checkmark for now or adding it
        { icon: 'bell', label: 'Notifications' }, // bell might be missing
        { icon: 'gear', label: 'Settings' }, // gear might be missing
        { icon: 'arrow.right.square', label: 'Logout' }, // arrow.right.square might be missing
    ];

    // Safe mapping fallback
    const getIcon = (name: string): IconSymbolName => {
        // Just returning a default if not strictly typed in the array above to match IconSymbolName
        return 'chevron.right' as IconSymbolName;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            <View style={styles.profileHeader}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn}>
                    <IconSymbol name="pencil" size={20} color="#0a7ea4" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.menu}>
                <MenuItem icon="person.fill" label="Personal Information" />
                <MenuItem icon="creditcard" label="Payment Methods" />
                <MenuItem icon="heart.fill" label="Favorites" />
                <MenuItem icon="gear" label="Settings" />
                <MenuItem icon="arrow.right.square" label="Logout" isDestructive />
            </ScrollView>

        </SafeAreaView>
    );
}

const MenuItem = ({ icon, label, isDestructive }: { icon: any, label: string, isDestructive?: boolean }) => (
    <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuIconBox}>
            <IconSymbol name={icon} size={20} color={isDestructive ? 'red' : '#333'} />
        </View>
        <Text style={[styles.menuLabel, isDestructive && styles.destructiveLabel]}>{label}</Text>
        <IconSymbol name="chevron.right" size={20} color="#ccc" />
    </TouchableOpacity>
);

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
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    editBtn: {
        padding: 8,
    },
    menu: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    destructiveLabel: {
        color: 'red',
    }
});
