import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import { addDays, getDaysDifference } from '../../utils/dates'

import { SafeAreaView } from 'react-native-safe-area-context'
import { IconSymbol } from '../../components/IconSymbol'
import { BackButton } from '../../components/ui/BackButton'
import { Button } from '../../components/ui/Button'
import { Colors } from '../../constants/Colors'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatDisplayDateTime(d: Date) {
  // e.g. "18 Dec 2025, 14:30"
  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// For web <input type="datetime-local">
function toHtmlDateTimeValue(d: Date) {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${y}-${m}-${day}T${hh}:${mm}`
}

function fromHtmlDateTimeValue(value: string) {
  if (!value) return null
  // "YYYY-MM-DDTHH:mm"
  const [datePart, timePart] = value.split('T')
  if (!datePart) return null
  const [y, m, d] = datePart.split('-').map(Number)
  const [hh, mm] = (timePart || '00:00').split(':').map(Number)
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0)
}

export default function BookingDatesScreen() {
  const { type, targetId, detailId } = useLocalSearchParams<{
    type: 'Hotel' | 'Tour'
    targetId: string
    detailId?: string
  }>()
  const router = useRouter()

  const colorScheme = useColorScheme() ?? 'light'
  const themeColors = Colors[colorScheme]

  const [checkInDate, setCheckInDate] = useState<Date>(new Date())
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 3))
  const [guests, setGuests] = useState(2)

  const [openPicker, setOpenPicker] = useState<null | 'checkin' | 'checkout'>(null)

  const checkInText = useMemo(() => formatDisplayDateTime(checkInDate), [checkInDate])
  const checkOutText = useMemo(() => formatDisplayDateTime(checkOutDate), [checkOutDate])

  const days = useMemo(() => {
    return getDaysDifference(checkInDate.toISOString(), checkOutDate.toISOString())
  }, [checkInDate, checkOutDate])

  const minCheckIn = useMemo(() => new Date(), [])
  const minCheckOut = useMemo(() => addDays(checkInDate, 1), [checkInDate])

  const applyCheckIn = (selected: Date) => {
    setCheckInDate(selected)
    // keep checkout >= checkin + 1 day
    if (selected >= checkOutDate) {
      setCheckOutDate(addDays(selected, 1))
    }
  }

  const applyCheckOut = (selected: Date) => {
    // prevent checkout <= checkin
    if (selected <= checkInDate) {
      setCheckOutDate(addDays(checkInDate, 1))
    } else {
      setCheckOutDate(selected)
    }
  }

  const onNativeChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Android closes on select/dismiss. iOS stays open until Done.
    if (Platform.OS !== 'ios') setOpenPicker(null)
    if (event.type === 'dismissed' || !selected) return

    if (openPicker === 'checkin') applyCheckIn(selected)
    if (openPicker === 'checkout') applyCheckOut(selected)
  }

  const handleContinue = () => {
    router.push({
      pathname: '/booking/summary',
      params: {
        type,
        targetId,
        detailId,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: guests.toString(),
        days: days.toString(),
      },
    })
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Select Dates',
          headerStyle: { backgroundColor: themeColors.background },
          headerTintColor: themeColors.text,
          headerLeft: () => <BackButton />,
        }}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>When are you going?</Text>

        <View style={styles.dateRow}>
          {/* CHECK-IN */}
          <View style={styles.dateInputGroup}>
            <Text style={[styles.label, { color: themeColors.subtext }]}>Check-in</Text>

            {Platform.OS === 'web' ? (
              <View style={[styles.inputBox, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}>
                <IconSymbol name="calendar" size={20} color={themeColors.subtext} />
                <input
                  type="datetime-local"
                  value={toHtmlDateTimeValue(checkInDate)}
                  min={toHtmlDateTimeValue(minCheckIn)}
                  onChange={(e) => {
                    const d = fromHtmlDateTimeValue(e.target.value)
                    if (d) applyCheckIn(d)
                  }}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: themeColors.text,
                    fontSize: 16,
                    marginLeft: 8,
                  }}
                />
              </View>
            ) : (
              <Pressable
                onPress={() => setOpenPicker('checkin')}
                style={[styles.inputBox, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}
              >
                <IconSymbol name="calendar" size={20} color={themeColors.subtext} />
                <Text style={[styles.inputText, { color: themeColors.text }]}>{checkInText}</Text>
              </Pressable>
            )}
          </View>

          {/* CHECK-OUT */}
          <View style={[styles.dateInputGroup, { marginRight: 0 }]}>
            <Text style={[styles.label, { color: themeColors.subtext }]}>Check-out</Text>

            {Platform.OS === 'web' ? (
              <View style={[styles.inputBox, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}>
                <IconSymbol name="calendar" size={20} color={themeColors.subtext} />
                <input
                  type="datetime-local"
                  value={toHtmlDateTimeValue(checkOutDate)}
                  min={toHtmlDateTimeValue(minCheckOut)}
                  onChange={(e) => {
                    const d = fromHtmlDateTimeValue(e.target.value)
                    if (d) applyCheckOut(d)
                  }}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: themeColors.text,
                    fontSize: 16,
                    marginLeft: 8,
                  }}
                />
              </View>
            ) : (
              <Pressable
                onPress={() => setOpenPicker('checkout')}
                style={[styles.inputBox, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}
              >
                <IconSymbol name="calendar" size={20} color={themeColors.subtext} />
                <Text style={[styles.inputText, { color: themeColors.text }]}>{checkOutText}</Text>
              </Pressable>
            )}
          </View>
        </View>

        <Text style={[styles.daysText, { color: themeColors.primary }]}>{days} nights stay</Text>

        {/* Guests */}
        <Text style={[styles.title, { marginTop: 32, color: themeColors.text }]}>Guests</Text>
        <View style={[styles.guestRow, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.guestLabel, { color: themeColors.text }]}>Adults</Text>

          <View style={styles.counter}>
            <TouchableOpacity
              onPress={() => setGuests(Math.max(1, guests - 1))}
              style={[
                styles.counterBtn,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
              ]}
            >
              <IconSymbol name="minus" size={20} color={themeColors.primary} />
            </TouchableOpacity>

            <Text style={[styles.guestCount, { color: themeColors.text }]}>{guests}</Text>

            <TouchableOpacity
              onPress={() => setGuests(guests + 1)}
              style={[
                styles.counterBtn,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
              ]}
            >
              <IconSymbol name="plus" size={20} color={themeColors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: themeColors.border, backgroundColor: themeColors.background }]}>
        <Button title="Continue" onPress={handleContinue} />
      </View>

      {/* Native Picker (Android/iOS only) */}
      {Platform.OS !== 'web' && openPicker && (
        <DateTimePicker
          value={openPicker === 'checkin' ? checkInDate : checkOutDate}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={openPicker === 'checkout' ? minCheckOut : minCheckIn}
          onChange={onNativeChange}
          themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
        />
      )}

      {/* iOS Done bar */}
      {Platform.OS === 'ios' && openPicker && (
        <View style={[styles.iosDoneBar, { borderTopColor: themeColors.border, backgroundColor: themeColors.card }]}>
          <Pressable onPress={() => setOpenPicker(null)} style={styles.iosDoneBtn}>
            <Text style={{ color: themeColors.primary, fontWeight: '700' }}>Done</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateInputGroup: { flex: 1, marginRight: 10 },
  label: { fontSize: 14, marginBottom: 8 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputText: { marginLeft: 8, fontSize: 16 },
  daysText: { marginTop: 12, fontWeight: '600' },

  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  guestLabel: { fontSize: 16 },
  counter: { flexDirection: 'row', alignItems: 'center' },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  guestCount: { fontSize: 18, fontWeight: '600', marginHorizontal: 16 },

  footer: { padding: 20, borderTopWidth: StyleSheet.hairlineWidth },

  iosDoneBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'flex-end',
  },
  iosDoneBtn: { paddingHorizontal: 12, paddingVertical: 6 },
})
