import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp } from 'react-native';

const MAPPING = {
    'house.fill': 'home',
    'heart.fill': 'favorite',
    'heart': 'favorite-border',
    'clock.fill': 'history',
    'message.fill': 'message',
    'person.fill': 'person',
    'chevron.left': 'chevron-left',
    'chevron.right': 'chevron-right',
    'magnifyingglass': 'search',
    'star.fill': 'star',
    'star': 'star-border',
    'mappin.and.ellipse': 'location-on',
    'bed.double.fill': 'hotel',
    'bed.double': 'bed',
    'airplane': 'flight',
    'bus': 'directions-bus',
    'calendar': 'calendar-today',
    'person.2.fill': 'group',
    'wifi': 'wifi',
    'fork.knife': 'restaurant',
    'arrow.left': 'arrow-back',
    'checkmark.circle.fill': 'check-circle',
    'plus.circle': 'add-circle-outline',
    'minus.circle': 'remove-circle-outline',
} as const; // using as const to infer keys better if needed, but for now we rely on the type below

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
    name,
    size = 24,
    color,
    style,
    onPress,
}: {
    name: IconSymbolName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<any>;
    weight?: SymbolWeight;
    onPress?: () => void;
}) {
    return (
        <MaterialIcons
            color={color}
            size={size}
            name={MAPPING[name]}
            style={style}
            onPress={onPress}
        />
    );
}
