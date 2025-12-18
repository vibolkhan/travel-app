import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol, IconSymbolName } from '../IconSymbol';
import { useAppColors } from '../../hooks/useAppColors';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: IconSymbolName;
}

export function EmptyState({ title, message, icon = 'magnifyingglass' }: EmptyStateProps) {
    const colors = useAppColors();
    return (
        <View style={styles.container}>
            <IconSymbol name={icon} size={48} color={colors.border} />
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.message, { color: colors.subtext }]}>{message}</Text>
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
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
});
