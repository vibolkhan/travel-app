import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/IconSymbol';
import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const activeColor = Colors[colorScheme].tint;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: Colors[colorScheme].icon,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: [
                    Platform.select({
                        ios: {
                            // Use a transparent background on iOS to show the blur effect
                            position: 'absolute',
                        },
                        default: {},
                    }),
                    {
                        backgroundColor: Colors[colorScheme].background,
                        borderTopColor: Colors[colorScheme].border,
                    }
                ],
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
