import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, DeviceEventEmitter } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Search, Bell, Menu, Home } from 'lucide-react-native';
import { useAppTheme } from '../../theme/theme';
import { useHeaderAnimations } from './useHeaderAnimations';
import AnimatedSearchPlaceholder from './AnimatedSearchPlaceholder';

export default function AnimatedHeader({ scrollY, title = "StudyDrive", navigation }) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const animations = useHeaderAnimations(scrollY, insets);

  useFocusEffect(
    useCallback(() => {
      DeviceEventEmitter.emit('UPDATE_TOP_INSET_COLOR', theme.colors.primary);
      return () => {
        DeviceEventEmitter.emit('UPDATE_TOP_INSET_COLOR', theme.colors.background);
      };
    }, [theme])
  );

  const shouldHidePlaceholder = isFocused || searchValue.length > 0;

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.colors.primary }, animations.headerHeight, theme.shadows.medium]}>
      
      <View style={[styles.topRow, { height: 60 }]}>
        <View style={styles.leftSection}>
          <Animated.View style={[styles.logoContainer, animations.logoTranslateX, animations.logoOpacity]}>
            <Home color={theme.colors.surface} size={28} strokeWidth={2.5} />
          </Animated.View>

          <Animated.View style={[styles.bellContainerAnimated, animations.bellTranslateX]}>
            <Pressable onPress={() => console.log('Ouvrir les notifications')}>
              <Bell color={theme.colors.surface} size={24} />
              <View style={[styles.badge, { backgroundColor: theme.colors.error }]} />
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.centerSection}>
          <Animated.Text style={[styles.title, { color: theme.colors.surface }, animations.titleOpacity]}>
            {title}
          </Animated.Text>
          <Animated.View style={[styles.miniSearchContainer, animations.miniSearchOpacity]}>
            <Search color={theme.colors.surface} size={20} />
          </Animated.View>
        </View>

        <View style={styles.rightSection}>
          <Pressable onPress={() => navigation.openDrawer && navigation.openDrawer()} style={styles.iconButton}>
            <Menu color={theme.colors.surface} size={28} />
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.bottomRow, animations.largeSearchOpacity, animations.largeSearchTranslateY]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
          <Search color={theme.colors.textMuted} size={20} style={styles.searchIcon} />
          
          <AnimatedSearchPlaceholder isHidden={shouldHidePlaceholder} />

          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[styles.searchInput, { color: theme.colors.text }]}
            selectionColor={theme.colors.primary}
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
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    zIndex: 1,
  },
});