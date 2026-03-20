import React from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Pressable } from 'react-native';
import Animated, { interpolate, Extrapolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Bell, Menu, Home } from 'lucide-react-native';
import { useAppTheme } from '../../theme/theme';

const HEADER_MAX_HEIGHT = 130;
const HEADER_MIN_HEIGHT = 60;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function AnimatedHeader({ scrollY, title = "StudyDrive", navigation }) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const headerHeight = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolate.CLAMP
    );
    return {
      height: height + insets.top,
      paddingTop: insets.top,
    };
  });

  const largeSearchOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE / 2],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const largeSearchTranslateY = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, -20],
      Extrapolate.CLAMP
    );
    return { transform: [{ translateY }] };
  });

  const miniSearchOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE / 2, SCROLL_DISTANCE],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const titleOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE / 2],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const logoTranslateX = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, -50], 
      Extrapolate.CLAMP
    );
    return { transform: [{ translateX }] };
  });

  const logoOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE / 1.5],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const bellTranslateX = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [50, 0], 
      Extrapolate.CLAMP
    );
    return { transform: [{ translateX }] };
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.colors.primary }, headerHeight, theme.shadows.medium]}>
      
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <Animated.View style={[styles.logoContainer, logoTranslateX, logoOpacity]}>
            <Home color={theme.colors.surface} size={28} strokeWidth={2.5} />
          </Animated.View>

          <Animated.View style={[styles.bellContainerAnimated, bellTranslateX]}>
            <Pressable onPress={() => console.log('Ouvrir les notifications')}>
              <Bell color={theme.colors.surface} size={24} />
              <View style={[styles.badge, { backgroundColor: theme.colors.error }]} />
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.centerSection}>
          <Animated.Text style={[styles.title, { color: theme.colors.surface }, titleOpacity]}>
            {title}
          </Animated.Text>
          <Animated.View style={[styles.miniSearchContainer, miniSearchOpacity]}>
            <Search color={theme.colors.surface} size={20} />
          </Animated.View>
        </View>

        <View style={styles.rightSection}>
          <Pressable onPress={() => navigation.openDrawer && navigation.openDrawer()} style={styles.iconButton}>
            <Menu color={theme.colors.surface} size={28} />
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.bottomRow, largeSearchOpacity, largeSearchTranslateY]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
          <Search color={theme.colors.textMuted} size={20} style={styles.searchIcon} />
          <TextInput
            placeholder="Rechercher des sujets, des membres..."
            placeholderTextColor={theme.colors.textDisabled}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
        </View>
      </Animated.View>
      
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    height: HEADER_MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
  },
  bellContainerAnimated: {
    position: 'absolute',
    left: 0,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#5170FF',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    position: 'absolute',
  },
  miniSearchContainer: {
    position: 'absolute',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 4,
  },
  bottomRow: {
    height: 70,
    paddingHorizontal: 16,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
});