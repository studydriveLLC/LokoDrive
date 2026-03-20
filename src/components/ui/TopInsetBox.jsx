import React, { useState, useEffect } from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme/theme';

export default function TopInsetBox() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  
  const [bgColor, setBgColor] = useState(theme.colors.background);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('UPDATE_TOP_INSET_COLOR', (color) => {
      setBgColor(color);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (insets.top === 0) return null;

  return (
    <View 
      style={[
        styles.shield, 
        { height: insets.top, backgroundColor: bgColor }
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  shield: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});