import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAppColors } from '../../hooks/useAppColors';

interface ChipProps {
    label: string;
    selected?: boolean;
    onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
    const colors = useAppColors();
    return (
        <TouchableOpacity
            style={[
                styles.container,
                selected
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, { color: selected ? '#fff' : colors.subtext }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
});
