import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence 
} from 'react-native-reanimated';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { formatCount } from '../../utils/formatters';
import { useAppTheme } from '../../theme/theme';

export default function PostActions({ likesCount, commentsCount, sharesCount, isLikedByMe, onCommentPress, onSharePress }) {
  const theme = useAppTheme();
  
  const [liked, setLiked] = useState(isLikedByMe);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);
  
  const scale = useSharedValue(1);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleLikePress = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLocalLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    // Animation "Pop" instantanée
    scale.value = withSequence(
      withSpring(1.4, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );

    // TODO: Envoyer la requête silencieuse au Backend ici
  };

  const actionColor = theme.colors.textMuted;
  const activeLikeColor = theme.colors.error; 

  return (
    <View style={[styles.container, { borderTopColor: theme.colors.divider }]}>
      <Pressable style={styles.actionButton} onPress={handleLikePress}>
        <Animated.View style={animatedIconStyle}>
          <Heart 
            color={liked ? activeLikeColor : actionColor} 
            size={22} 
            fill={liked ? activeLikeColor : 'transparent'} 
          />
        </Animated.View>
        <Text style={[styles.actionText, { color: liked ? activeLikeColor : actionColor }]}>
          {formatCount(localLikesCount)}
        </Text>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={onCommentPress}>
        <MessageCircle color={actionColor} size={22} />
        <Text style={[styles.actionText, { color: actionColor }]}>
          {formatCount(commentsCount)}
        </Text>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={onSharePress}>
        <Share2 color={actionColor} size={22} />
        <Text style={[styles.actionText, { color: actionColor }]}>
          {formatCount(sharesCount)}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});