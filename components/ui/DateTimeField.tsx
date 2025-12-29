import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import React from 'react'
import { IconSymbol } from '../IconSymbol'

type Mode = 'date' | 'datetime'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

// For <input type="date"> / "datetime-local"
function toHtmlValue(date: Date, mode: Mode) {
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  if (mode === 'date') return `${y}-${m}-${d}`

  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  return `${y}-${m}-${d}T${hh}:${mm}`
}

function fromHtmlValue(value: string, mode: Mode) {
  if (!value) return null
  if (mode === 'date') {
    // YYYY-MM-DD
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, (m || 1) - 1, d || 1)
  }
  // YYYY-MM-DDTHH:mm
  const [datePart, timePart] = value.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  const [hh, mm] = (timePart || '00:00').split(':').map(Number)
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0)
}

function formatDisplay(date: Date, mode: Mode) {
  if (mode === 'date') {
    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
  }
  return date.toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function DateTimeField({
  label,
  value,
  onChange,
  mode = 'date',
  colors,
  minimumDate,
}: {
  label: string
  value: Date
  onChange: (d: Date) => void
  mode?: Mode
  colors: { background: string; card: string; border: string; text: string; subtext: string; primary: string }
  minimumDate?: Date
}) {
  const [open, setOpen] = React.useState(false)

  const onNativeChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Android closes on select/dismiss. iOS stays open (spinner).
    if (Platform.OS !== 'ios') setOpen(false)
    if (event.type === 'dismissed' || !selected) return
    onChange(selected)
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={[styles.label, { color: colors.subtext }]}>{label}</Text>

      {Platform.OS === 'web' ? (
        <View style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <IconSymbol name="calendar" size={20} color={colors.subtext} />
          <input
            value={toHtmlValue(value, mode)}
            onChange={(e) => {
              const d = fromHtmlValue(e.target.value, mode)
              if (d) onChange(d)
            }}
            type={mode === 'date' ? 'date' : 'datetime-local'}
            min={minimumDate ? toHtmlValue(minimumDate, mode === 'date' ? 'date' : 'datetime') : undefined}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: colors.text,
              fontSize: 16,
              marginLeft: 8,
            }}
          />
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => setOpen(true)}
            style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <IconSymbol name="calendar" size={20} color={colors.subtext} />
            <Text style={[styles.text, { color: colors.text }]}>{formatDisplay(value, mode)}</Text>
          </Pressable>

          {open && (
            <DateTimePicker
              value={value}
              mode={mode === 'date' ? 'date' : 'datetime'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={minimumDate}
              onChange={onNativeChange}
              // works on iOS + Android (ignored on some versions)
              themeVariant="dark" // you can switch based on your scheme if you want
            />
          )}

          {Platform.OS === 'ios' && open && (
            <View style={[styles.iosDoneBar, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
              <Pressable onPress={() => setOpen(false)} style={styles.iosDoneBtn}>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>Done</Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  label: { fontSize: 14, marginBottom: 8 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  text: { marginLeft: 8, fontSize: 16 },
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
