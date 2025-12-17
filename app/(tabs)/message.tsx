// File: app/(tabs)/message.tsx

import { SafeAreaView, StyleSheet, View } from 'react-native';

import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';

export default function MessageTab() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <EmptyState
          icon="chat-bubble-outline"
          title="Messages"
          subtitle="This is a mock inbox. Hook this up to your real chat API later."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16, justifyContent: 'center' },
});
