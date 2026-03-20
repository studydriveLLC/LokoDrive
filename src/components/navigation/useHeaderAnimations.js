import { interpolate, Extrapolate, useAnimatedStyle } from 'react-native-reanimated';

export const HEADER_MAX_HEIGHT = 130;
export const HEADER_MIN_HEIGHT = 60;
export const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export function useHeaderAnimations(scrollY, insets) {
  const headerHeight = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT], Extrapolate.CLAMP);
    return {
      height: height + insets.top,
      paddingTop: insets.top,
    };
  });

  const largeSearchOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, SCROLL_DISTANCE / 2], [1, 0], Extrapolate.CLAMP)
  }));

  const largeSearchTranslateY = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, SCROLL_DISTANCE], [0, -20], Extrapolate.CLAMP) }]
  }));

  const miniSearchOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [SCROLL_DISTANCE / 2, SCROLL_DISTANCE], [0, 1], Extrapolate.CLAMP)
  }));

  const titleOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, SCROLL_DISTANCE / 2], [1, 0], Extrapolate.CLAMP)
  }));

  const logoTranslateX = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(scrollY.value, [0, SCROLL_DISTANCE], [0, -50], Extrapolate.CLAMP) }]
  }));

  const logoOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, SCROLL_DISTANCE / 1.5], [1, 0], Extrapolate.CLAMP)
  }));

  const bellTranslateX = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(scrollY.value, [0, SCROLL_DISTANCE], [50, 0], Extrapolate.CLAMP) }]
  }));

  return {
    headerHeight,
    largeSearchOpacity,
    largeSearchTranslateY,
    miniSearchOpacity,
    titleOpacity,
    logoTranslateX,
    logoOpacity,
    bellTranslateX,
  };
}