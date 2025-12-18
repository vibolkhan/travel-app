import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function AccountScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { user, isAuthenticated, logout } = useAuth();
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(false);

    const handleEdit = (field: string) => {
        Alert.alert('Edit', `Edit ${field}`);
    };

    const handleAddPayment = () => {
        Alert.alert('Add Payment', 'Add New Payment Method clicked');
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/auth/login');
        } catch (error) {
            Alert.alert('Error', 'Failed to logout');
        }
    };

    const handleLogin = () => {
        router.push('/auth/login');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? themeColors.background : '#f5f5f5' }]} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        {isAuthenticated && (user?.name || user?.email) ? (
                            <View style={[styles.avatar, styles.initialsAvatar, { borderColor: themeColors.background }]}>
                                <Text style={styles.avatarInitials}>
                                    {(user?.name || user?.email || 'G').charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        ) : (
                            <Image
                                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                                style={[styles.avatar, { borderColor: themeColors.background }]}
                            />
                        )}
                        {isAuthenticated && (
                            <View style={[styles.roleBadge, { borderColor: themeColors.background }]}>
                                <Text style={styles.roleText}>{user?.role || 'Traveler'}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={[styles.name, { color: themeColors.text }]}>{isAuthenticated ? (user?.name || 'User') : 'Guest'}</Text>
                    <Text style={[styles.email, { color: themeColors.subtext }]}>{isAuthenticated ? user?.email : 'Not logged in'}</Text>
                    {!isAuthenticated && (
                        <TouchableOpacity style={[styles.loginPrompt, { backgroundColor: themeColors.primary }]} onPress={handleLogin}>
                            <Text style={styles.loginPromptText}>Tap to Login</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Account Settings */}
                <View style={[styles.section, { backgroundColor: themeColors.card }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Account Settings</Text>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: themeColors.subtext }]}>Change Password</Text>
                        <TouchableOpacity style={[styles.smallButton, { backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f9f9f9', borderColor: themeColors.border }]} onPress={() => handleEdit('Password')}>
                            <Text style={styles.smallButtonText}>EDIT</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: themeColors.subtext }]}>Two-Factor Authentication</Text>
                        <Switch
                            value={is2FAEnabled}
                            onValueChange={setIs2FAEnabled}
                            trackColor={{ false: colorScheme === 'dark' ? '#333' : '#e0e0e0', true: colorScheme === 'dark' ? '#1a237e' : '#cce5ff' }}
                            thumbColor={is2FAEnabled ? themeColors.primary : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Payment Methods */}
                <View style={[styles.section, { backgroundColor: themeColors.card }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Payment Methods</Text>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: themeColors.subtext }]}>Visa ending in 1234</Text>
                        <TouchableOpacity style={[styles.smallButton, { backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f9f9f9', borderColor: themeColors.border }]} onPress={() => handleEdit('Payment Method')}>
                            <Text style={styles.smallButtonText}>EDIT</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: themeColors.subtext }]}>Add New Payment Method</Text>
                        <TouchableOpacity style={[styles.smallButton, styles.addButton, { backgroundColor: colorScheme === 'dark' ? '#1b2601' : '#f4f8e6', borderColor: colorScheme === 'dark' ? '#2e3b0e' : '#e0e8c0' }]} onPress={handleAddPayment}>
                            <Text style={[styles.smallButtonText, styles.addButtonText]}>ADD</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preferences */}
                <View style={[styles.section, { backgroundColor: themeColors.card }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Preferences</Text>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: themeColors.subtext }]}>Language</Text>
                        <View style={[styles.dropdownMock, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' }]}>
                            <Text style={[styles.dropdownText, { color: themeColors.subtext }]}>English</Text>
                            <Text style={[styles.dropdownIcon, { color: themeColors.subtext }]}>▼</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: themeColors.subtext }]}>Notifications</Text>
                        <Switch
                            value={areNotificationsEnabled}
                            onValueChange={setAreNotificationsEnabled}
                            trackColor={{ false: colorScheme === 'dark' ? '#333' : '#e0e0e0', true: colorScheme === 'dark' ? '#1a237e' : '#cce5ff' }}
                            thumbColor={areNotificationsEnabled ? themeColors.primary : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                {isAuthenticated && (
                    <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colorScheme === 'dark' ? '#1b2601' : '#f4f8e6', borderColor: colorScheme === 'dark' ? '#2e3b0e' : '#e0e8c0' }]} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>LOGOUT</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Light gray background as often seen in glassmorphism/cards
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff', // Optional: adds a nice border
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
        alignItems: 'center',
    },
    initialsAvatar: {
        backgroundColor: '#0a7ea4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    roleBadge: {
        position: 'absolute',
        bottom: -5,
        backgroundColor: '#ffa31a',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#fff',
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
    },
    name: {
        fontSize: 24,
        fontWeight: '500', // Medium weight looking font
        color: '#333',
        letterSpacing: 0.5,
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: '#888',
        textDecorationLine: 'underline',
    },
    section: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        // Shadow for "card" feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 20,
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        fontWeight: '400',
    },
    smallButton: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 4,
        minWidth: 70,
        alignItems: 'center',
        // Slight shadow to match button look in image
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    smallButtonText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
    addButton: {
        backgroundColor: '#f4f8e6', // Light greenish yellow from image
        borderColor: '#e0e8c0',
    },
    addButtonText: {
        color: '#a0a0a0',
    },
    upgradeContainer: {
        marginBottom: 20,
        zIndex: 1, // Ensure it appears above if needed, though mostly visual flow
    },
    upgradeButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    upgradeButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    dropdownMock: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    dropdownText: {
        fontSize: 14,
        color: '#888',
        marginRight: 6,
    },
    dropdownIcon: {
        fontSize: 10,
        color: '#888',
    },
    logoutButton: {
        width: '100%',
        backgroundColor: '#f4f8e6', // Similar to ADD button background
        paddingVertical: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e0e8c0',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#b0b0b0', // Grayish text for logout
        letterSpacing: 1,
    },
    loginPrompt: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#0a7ea4',
        borderRadius: 8,
    },
    loginPromptText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
