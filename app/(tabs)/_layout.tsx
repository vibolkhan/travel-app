import { Platform, StyleSheet, useColorScheme, useWindowDimensions } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { Tabs } from 'expo-router'
import { IconSymbol } from '../../components/IconSymbol'
import { Colors } from '../../constants/Colors'

const BREAKPOINT_MD = 900

export default function TabLayout() {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const c = Colors[colorScheme]
  const { width } = useWindowDimensions()

  const hideTabBar = Platform.OS === 'web' && width >= BREAKPOINT_MD

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: hideTabBar ? undefined : HapticTab,
        tabBarStyle: hideTabBar
          ? [{ display: 'none' } as any]
          : [{ backgroundColor: c.background, borderTopColor: c.border, borderTopWidth: StyleSheet.hairlineWidth }],
        tabBarActiveTintColor: c.tint ?? c.primary,
        tabBarInactiveTintColor: c.icon,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="mappin.and.ellipse" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="airplane" color={color} />,
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  )
}
