import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function AccountScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const themeColors = Colors[colorScheme];

  const { user, isAuthenticated, logout } = useAuth();

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(false);

  const themed = useMemo(
    () => ({
      bg: themeColors.background,
      card: themeColors.card,
      border: themeColors.border,
      text: themeColors.text,
      subtext: themeColors.subtext,
      primary: themeColors.primary,
      error: themeColors.error,

      // neutral surfaces (buttons, dropdowns)
      surface: colorScheme === 'dark' ? '#2c2c2c' : '#f9f9f9',
      surface2: colorScheme === 'dark' ? '#333' : '#f0f0f0',

      // for initials avatar & badge
      avatarBg: themeColors.primary,
      avatarText: '#fff',

      // role badge
      roleBg: colorScheme === 'dark' ? '#b36b00' : '#ffa31a',
      roleText: '#fff',

      // "success-ish" soft surface (Add/Logout)
      softActionBg: colorScheme === 'dark' ? '#1b2601' : '#f4f8e6',
      softActionBorder: colorScheme === 'dark' ? '#2e3b0e' : '#e0e8c0',
      softActionText: themeColors.subtext,
    }),
    [themeColors, colorScheme]
  );

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

  const switchTrack = {
    false: colorScheme === 'dark' ? '#333' : '#e0e0e0',
    true: colorScheme === 'dark' ? '#1a237e' : '#cce5ff',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.bg }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {isAuthenticated && (user?.name || user?.email) ? (
              <View style={[styles.avatar, styles.initialsAvatar, { backgroundColor: themed.avatarBg, borderColor: themed.bg }]}>
                <Text style={[styles.avatarInitials, { color: themed.avatarText }]}>
                  {(user?.name || user?.email || 'G').charAt(0).toUpperCase()}
                </Text>
              </View>
            ) : (
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={[styles.avatar, { borderColor: themed.bg }]}
              />
            )}

            {isAuthenticated && (
              <View style={[styles.roleBadge, { backgroundColor: themed.roleBg, borderColor: themed.bg }]}>
                <Text style={[styles.roleText, { color: themed.roleText }]}>{user?.role || 'Traveler'}</Text>
              </View>
            )}
          </View>

          <Text style={[styles.name, { color: themed.text }]}>
            {isAuthenticated ? (user?.name || 'User') : 'Guest'}
          </Text>
          <Text style={[styles.email, { color: themed.subtext }]}>
            {isAuthenticated ? user?.email : 'Not logged in'}
          </Text>

          {!isAuthenticated && (
            <TouchableOpacity style={[styles.loginPrompt, { backgroundColor: themed.primary }]} onPress={handleLogin}>
              <Text style={styles.loginPromptText}>Tap to Login</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Account Settings */}
        <View style={[styles.section, { backgroundColor: themed.card, borderColor: themed.border }]}>
          <Text style={[styles.sectionTitle, { color: themed.text }]}>Account Settings</Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themed.subtext }]}>Change Password</Text>
            <TouchableOpacity
              style={[styles.smallButton, { backgroundColor: themed.surface, borderColor: themed.border }]}
              onPress={() => handleEdit('Password')}
            >
              <Text style={[styles.smallButtonText, { color: themed.subtext }]}>EDIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themed.subtext }]}>Two-Factor Authentication</Text>
            <Switch
              value={is2FAEnabled}
              onValueChange={setIs2FAEnabled}
              trackColor={switchTrack}
              thumbColor={is2FAEnabled ? themed.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Payment Methods */}
        <View style={[styles.section, { backgroundColor: themed.card, borderColor: themed.border }]}>
          <Text style={[styles.sectionTitle, { color: themed.text }]}>Payment Methods</Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themed.subtext }]}>Visa ending in 1234</Text>
            <TouchableOpacity
              style={[styles.smallButton, { backgroundColor: themed.surface, borderColor: themed.border }]}
              onPress={() => handleEdit('Payment Method')}
            >
              <Text style={[styles.smallButtonText, { color: themed.subtext }]}>EDIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themed.subtext }]}>Add New Payment Method</Text>
            <TouchableOpacity
              style={[
                styles.smallButton,
                { backgroundColor: themed.softActionBg, borderColor: themed.softActionBorder },
              ]}
              onPress={handleAddPayment}
            >
              <Text style={[styles.smallButtonText, { color: themed.softActionText }]}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={[styles.section, { backgroundColor: themed.card, borderColor: themed.border }]}>
          <Text style={[styles.sectionTitle, { color: themed.text }]}>Preferences</Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themed.subtext }]}>Language</Text>
            <View style={[styles.dropdownMock, { backgroundColor: themed.surface2, borderColor: themed.border }]}>
              <Text style={[styles.dropdownText, { color: themed.subtext }]}>English</Text>
              <Text style={[styles.dropdownIcon, { color: themed.subtext }]}>▼</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themed.subtext }]}>Notifications</Text>
            <Switch
              value={areNotificationsEnabled}
              onValueChange={setAreNotificationsEnabled}
              trackColor={switchTrack}
              thumbColor={areNotificationsEnabled ? themed.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Logout Button */}
        {isAuthenticated && (
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: themed.softActionBg, borderColor: themed.softActionBorder }]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutButtonText, { color: themed.softActionText }]}>LOGOUT</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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

  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
    alignItems: 'center',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },

  initialsAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarInitials: {
    fontSize: 40,
    fontWeight: 'bold',
  },

  roleBadge: {
    position: 'absolute',
    bottom: -5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
  },

  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  name: {
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 5,
  },

  email: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  section: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,

    // keep shadows but they’ll look different in dark mode (that’s OK)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
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
    fontWeight: '400',
  },

  smallButton: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },

  smallButtonText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },

  dropdownMock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
  },

  dropdownText: { fontSize: 14, marginRight: 6 },
  dropdownIcon: { fontSize: 10 },

  logoutButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 4,
    borderWidth: 1,
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
    letterSpacing: 1,
  },

  loginPrompt: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  loginPromptText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
