import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { IconSymbol, IconSymbolName } from '../IconSymbol';

import React from 'react';
import { Colors } from '../../constants/Colors';
import { useAppColors } from '../../hooks/useAppColors';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: IconSymbolName;
}

export function EmptyState({ title, message, icon = 'magnifyingglass' }: EmptyStateProps) {
    const navColors = useAppColors();
    const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
    const theme = Colors[colorScheme];

    // Prefer the app-wide Colors based on the OS color scheme so EmptyState
    // matches screens that use `Colors[scheme]`. Fall back to navigation
    // theme colors only if needed.
    const iconColor = theme.border || (navColors && (navColors.border as string));
    const titleColor = theme.text || (navColors && (navColors.text as string));
    const messageColor = theme.subtext || (navColors && (navColors.subtext as string));

    return (
        <View style={styles.container}>
            <IconSymbol name={icon} size={48} color={iconColor} />
            <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
            <Text style={[styles.message, { color: messageColor }]}>{message}</Text>
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
