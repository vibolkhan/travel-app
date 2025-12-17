import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ChipProps {
    label: string;
    selected?: boolean;
    onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                selected ? styles.selectedContainer : styles.unselectedContainer,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, selected ? styles.selectedText : styles.unselectedText]}>
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
    unselectedContainer: {
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
    },
    selectedContainer: {
        backgroundColor: '#0a7ea4',
        borderColor: '#0a7ea4',
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
    unselectedText: {
        color: '#666',
    },
    selectedText: {
        color: '#fff',
    },
});
