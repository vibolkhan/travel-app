import { StyleSheet, TextInput, View } from 'react-native';

import React from 'react';
import { useAppColors } from '../../hooks/useAppColors';
import { IconSymbol } from '../IconSymbol';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search...' }: SearchBarProps) {
    const colors = useAppColors();
    return (
        <View style={[styles.container, { backgroundColor: colors.text, borderColor: colors.card }]}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.card} style={styles.icon} />
            <TextInput
                style={[styles.input, { color: colors.card }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.card}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
});
