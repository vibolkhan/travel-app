import { Href, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '../IconSymbol';

export function BackButton({ fallbackHref }: { fallbackHref?: Href }) {
    const router = useRouter();

    const handlePress = () => {
        if (router.canGoBack()) {
            router.back();
        } else if (fallbackHref) {
            router.replace(fallbackHref);
        }
    };

    if (!router.canGoBack() && !fallbackHref) return null;

    return (
        <TouchableOpacity onPress={handlePress} style={styles.button}>
            <IconSymbol name="chevron.left" size={28} color="#007AFF" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        marginLeft: -8, // Align with the edge slightly better
    },
});
