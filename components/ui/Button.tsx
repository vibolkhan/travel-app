import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    loading?: boolean;
    disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', style, loading, disabled }: ButtonProps) {
    const getBackgroundColor = () => {
        if (disabled) return '#ccc';
        switch (variant) {
            case 'primary': return '#0a7ea4';
            case 'secondary': return '#f0f0f0';
            case 'outline': return 'transparent';
            default: return '#0a7ea4';
        }
    };

    const getTextColor = () => {
        if (disabled) return '#666';
        switch (variant) {
            case 'primary': return '#fff';
            case 'secondary': return '#333';
            case 'outline': return '#0a7ea4';
            default: return '#fff';
        }
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 1, borderColor: '#0a7ea4' };
        return {};
    };

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: getBackgroundColor() }, getBorder(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
