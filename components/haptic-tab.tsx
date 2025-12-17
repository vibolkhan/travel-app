import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, ViewStyle } from "react-native";

import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export function HapticTab(props: BottomTabBarButtonProps) {
  const { children, onPress, accessibilityState, style } = props;
  const focused = !!accessibilityState?.selected;

  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(lift, {
      toValue: focused ? -2 : 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [focused, lift]);

  const handlePress = (e: any) => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.12, useNativeDriver: true, speed: 30, bounciness: 10 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 10 }),
    ]).start();
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.pressable, style as ViewStyle]}
      android_ripple={{ color: "rgba(11,95,255,0.12)", borderless: true }}
    >
      <Animated.View
        style={[
          styles.wrap,
          { transform: [{ translateY: lift }, { scale }] },
          focused ? styles.activeWrap : styles.inactiveWrap,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { flex: 1, alignItems: "center", justifyContent: "center" },
  wrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  activeWrap: {
    backgroundColor: "rgba(11, 95, 255, 0.14)",
  },
  inactiveWrap: {
    backgroundColor: "transparent",
  },
});
