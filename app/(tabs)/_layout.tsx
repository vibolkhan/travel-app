import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/IconSymbol';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';

// If you have BlurView installed and want blur on iOS:
// import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const c = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarActiveTintColor: c.tint ?? c.primary,
        tabBarInactiveTintColor: c.icon,

        tabBarStyle: [
          Platform.select({
            ios: {
              position: 'absolute',
              backgroundColor: 'transparent', // important for iOS overlay/blur look
              borderTopColor: c.border,
            },
            default: {
              backgroundColor: c.background,
              borderTopColor: c.border,
            },
          }),
        ],

        // Optional: if you use blur on iOS, uncomment BlurView import above and this block.
        // tabBarBackground: () =>
        //   Platform.OS === 'ios' ? (
        //     <BlurView intensity={30} tint={colorScheme} style={{ flex: 1 }} />
        //   ) : null,
      }}
    >
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
