import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { hideErrorToast } from '../../store/slices/uiSlice';
import { theme } from '../../theme/theme';

export default function ErrorToast() {
  const dispatch = useDispatch();
  const { isVisible, message } = useSelector((state) => state.ui.errorToast);
  const translateY = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: 20,
        useNativeDriver: true,
        speed: 12,
      }).start();

      const timer = setTimeout(() => {
        dispatch(hideErrorToast());
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(translateY, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, dispatch, translateY]);

  if (!isVisible && translateY._value === -150) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <SafeAreaView>
        <View style={styles.toastBox}>
          <Text style={styles.text}>{message}</Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: theme.spacing.m,
  },
  toastBox: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    ...theme.shadows.medium,
  },
  text: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
  },
});