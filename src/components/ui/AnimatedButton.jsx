import React, { useRef } from 'react';
import { Text, Animated, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';

export default function AnimatedButton({ title, onPress, isLoading, disabled, style }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || isLoading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || isLoading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      <Animated.View style={[
        styles.button,
        (disabled && !isLoading) && styles.buttonDisabled,
        style,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {isLoading ? (
          <ActivityIndicator color={theme.colors.surface} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    ...theme.shadows.medium,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.textDisabled,
    ...theme.shadows.none,
  },
  text: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.bold,
  },
});