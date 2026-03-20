import React, { useEffect } from 'react';
import { Modal, StyleSheet, Pressable, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../theme/theme';

export default function LiquidModal({ visible, onClose, children }) {
  const theme = useAppTheme();
  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    } else {
      translateY.value = withTiming(1000, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const handleClose = () => {
    translateY.value = withTiming(1000, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 }, (isFinished) => {
      if (isFinished) {
        runOnJS(onClose)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedBackdrop = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={handleClose}>
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, animatedBackdrop]}>
          <Pressable style={styles.flex} onPress={handleClose}>
            <BlurView intensity={20} tint="dark" style={styles.flex} />
          </Pressable>
        </Animated.View>

        <Animated.View style={[
          styles.content, 
          { backgroundColor: theme.colors.glassBackground, borderColor: theme.colors.glassBorder },
          animatedStyle
        ]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 21, 36, 0.4)',
  },
  flex: {
    flex: 1,
  },
  content: {
    margin: 16,
    marginBottom: 40,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
});