import { Stack, useRouter } from 'expo-router'
import { StyleSheet, Text, View, useColorScheme } from 'react-native'

import React from 'react'
import { IconSymbol } from '../../components/IconSymbol'
import { Button } from '../../components/ui/Button'

import { useThemeColors } from '../../hooks/useThemeColors'

export default function BookingSuccessScreen() {
  const router = useRouter()
  const colors = useThemeColors()
  const colorScheme = useColorScheme() ?? 'light'
  const dark = colorScheme === 'dark'

  const handleHome = () => {
    router.replace('/(tabs)/explore')
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}> 
        <View style={[styles.card, { backgroundColor: colors.card }]}> 
          <View style={styles.iconCircle}>
            <IconSymbol name="checkmark.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Booking Confirmed!</Text>

          <Text style={[styles.message, { color: colors.subtext }]}> 
            Your trip has been successfully booked. You can view details in your trips history.
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.footer,
          {
            backgroundColor: 'transparent',
            borderTopColor: colors.border,
            borderTopWidth: StyleSheet.hairlineWidth,
          },
        ]}
      >
        <Button title="Back to Home" onPress={handleHome} style={styles.fullButton} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCircle: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footer: {
    paddingBottom: 20,
  },
  fullButton: {
    width: '100%',
    borderRadius: 8,
  },
})
