import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export default function AnimatedInput({ 
  label, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType, 
  autoCapitalize, 
  style 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value === '' ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: (isFocused || value !== '') ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: theme.spacing.m,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [20, theme.spacing.xs],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.typography.sizes.body, theme.typography.sizes.small],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.textMuted, theme.colors.primary],
    }),
  };

  const borderColor = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.primary],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.inputWrapper, { borderColor }]}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.m,
    height: 64,
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.xs,
    ...theme.shadows.small,
  },
  input: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
    padding: 0,
    margin: 0,
    height: 24,
  },
});