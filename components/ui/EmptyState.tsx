import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol, IconSymbolName } from '../IconSymbol';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: IconSymbolName;
}

export function EmptyState({ title, message, icon = 'search' }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <IconSymbol name={icon} size={48} color="#ccc" />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        color: '#333',
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
});
