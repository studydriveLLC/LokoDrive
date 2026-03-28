// src/components/feed/PostContent.jsx
import React, { useRef } from 'react';
import { View, Image, StyleSheet, Pressable, Text, Animated } from 'react-native';
import { Play } from 'lucide-react-native';
import { useAppTheme } from '../../theme/theme';
import { formatCount } from '../../utils/formatters';

export default function PostContent({ content, onPress }) {
  const theme = useAppTheme();
  const colorAnim = useRef(new Animated.Value(0)).current;

  if (!content) return null;

  // 1. CAS DU TEXTE SIMPLE AVEC FOND COLORE
  if (content.mediaType === 'none' && content.textBackground !== 'none') {
    const baseColor = theme.colors[content.textBackground] || theme.colors.primary;
    
    // Configuration de l'animation arc-en-ciel
    const animatedBg = colorAnim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [
        baseColor, 
        theme.colors.primaryLight, 
        theme.colors.info || '#A1C4FD', 
        theme.colors.warning || '#FBC2EB', 
        baseColor
      ]
    });

    const handleTouchStart = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(colorAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
          Animated.timing(colorAnim, { toValue: 0, duration: 2000, useNativeDriver: false })
        ])
      ).start();
    };

    const handleTouchEnd = () => {
      colorAnim.stopAnimation();
      Animated.timing(colorAnim, { toValue: 0, duration: 400, useNativeDriver: false }).start();
    };

    return (
      <Pressable 
        style={styles.textBackgroundContainer}
        onPressIn={handleTouchStart}
        onPressOut={handleTouchEnd}
      >
        <Animated.View style={[styles.textBackgroundBlock, { backgroundColor: animatedBg }]}>
          <Text style={styles.textOnBackground} numberOfLines={8}>
            {content.text}
          </Text>
        </Animated.View>
      </Pressable>
    );
  }

  // 2. CAS DES MEDIAS (Images ou Videos)
  if (content.mediaUrls && content.mediaUrls.length > 0) {
    const mainMediaUrl = content.mediaUrls[0];
    
    return (
      <Pressable 
        style={[styles.container, { borderColor: theme.colors.border }]} 
        onPress={onPress}
      >
        <Image 
          source={{ uri: mainMediaUrl }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {content.mediaType === 'video' && (
          <View style={[styles.videoOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
            <View style={[styles.playButton, { backgroundColor: theme.colors.primary }]}>
              <Play color={theme.colors.surface} size={24} fill={theme.colors.surface} style={styles.playIcon} />
            </View>
            <View style={[styles.viewsBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
              <Text style={styles.viewsText}>Video</Text>
            </View>
          </View>
        )}
      </Pressable>
    );
  }

  // Si c'est du texte simple SANS fond, il est deja gere par le PostHeader. On ne retourne rien ici.
  return null;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 240,
    marginTop: 8,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  playIcon: {
    marginLeft: 4, 
  },
  viewsBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  viewsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  textBackgroundContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  textBackgroundBlock: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  textOnBackground: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  }
});