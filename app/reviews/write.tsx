// File: app/reviews/write.tsx

import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { useBookingStore } from '../../store/useBookingStore';

export default function WriteReview() {
  const { itemType, itemId } = useLocalSearchParams<{ itemType: 'destination' | 'hotel' | 'tour'; itemId: string }>();
  const addReview = useBookingStore((s) => s.addReview);

  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const submit = () => {
    if (text.trim().length < 10) {
      Alert.alert('Add more details', 'Please write at least 10 characters.');
      return;
    }
    addReview({
      id: `local-${Date.now()}`,
      itemType,
      itemId,
      author: 'You',
      avatar: 'https://i.pravatar.cc/150?img=32',
      rating,
      dateISO: new Date().toISOString().slice(0, 10),
      text: text.trim(),
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Write a review</Text>

        <Text style={styles.label}>Rating</Text>
        <View style={styles.stars}>
          {stars.map((s) => (
            <Pressable key={s} onPress={() => setRating(s)} hitSlop={10} style={{ padding: 4 }}>
              <MaterialIcons name={s <= rating ? 'star' : 'star-border'} size={28} color="#F59E0B" />
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Your thoughts</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="What did you like? What could be better?"
          placeholderTextColor="#9CA3AF"
          multiline
          style={styles.input}
        />

        <View style={{ marginTop: 14 }}>
          <Button title="Submit review" onPress={submit} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  label: { marginTop: 16, marginBottom: 8, fontSize: 14, fontWeight: '900', color: '#111827' },
  stars: { flexDirection: 'row', alignItems: 'center' },
  input: {
    minHeight: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    fontWeight: '600',
    color: '#111827',
    textAlignVertical: 'top',
  },
});
