import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { useColorScheme } from 'react-native'; // Or your theme hook
import { HapticTab } from '../../components/HapticTab';
import { IconSymbol } from '../../components/IconSymbol';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const themeColor = '#0a7ea4'; // Hardcoded for now, ideal to use theme

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: themeColor,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="mappin.and.ellipse" color={color} />,
                }}
            />
            <Tabs.Screen
                name="favorite"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Trips',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="airplane" color={color} />,
                }}
            />
            <Tabs.Screen
                name="message"
                options={{
                    title: 'Inbox',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}
