import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    loading?: boolean;
    disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', style, loading, disabled }: ButtonProps) {
    const colors = useThemeColors();
    const getBackgroundColor = () => {
        if (disabled) return colors.border; // use border color for disabled background
        switch (variant) {
            case 'primary':
                return colors.primary;
            case 'secondary':
                return colors.card; // use card/background for secondary
            case 'outline':
                return 'transparent';
            default:
                return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.subtext;
        switch (variant) {
            case 'primary':
                // Ensure contrast on primary background
                return colors.text;
            case 'secondary':
                return colors.text;
            case 'outline':
                return colors.primary;
            default:
                return colors.text;
        }
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 1, borderColor: colors.primary };
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
