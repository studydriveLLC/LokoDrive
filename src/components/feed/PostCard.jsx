// src/components/feed/PostCard.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Repeat } from 'lucide-react-native';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import { useAppTheme } from '../../theme/theme';
import { formatCount } from '../../utils/formatters';

export default function PostCard({
  post,
  currentUserId,
  onOpenComments,
  onOpenDescription,
  onOpenShare,
  onOpenOptions,
  onLike,
}) {
  const theme = useAppTheme();

  // On recupere les statistiques en appliquant notre utilitaire de formatage (ex: 1500 -> 1.5k)
  const likesFormatted = formatCount(post?.stats?.likes);
  const commentsFormatted = formatCount(post?.stats?.comments);
  const sharesFormatted = formatCount(post?.stats?.shares);

  const isMyPost = currentUserId === post?.author?._id;

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }
    ]}>
      {post.isRepost && post.originalPost && (
        <View style={styles.repostBanner}>
          <Repeat color={theme.colors.textMuted} size={14} />
          <Text style={[styles.repostText, { color: theme.colors.textMuted }]}>
            Repartage depuis chez {post.originalPost.author?.pseudo || 'un utilisateur'}
          </Text>
        </View>
      )}

      <View style={styles.internalPadding}>
        <PostHeader
          author={post.author}
          date={post.createdAt}
          description={post.content?.text}
          hideDescription={post.content?.textBackground !== 'none'}
          onReadMore={() => onOpenDescription && onOpenDescription(post)}
          onOptionsPress={() => onOpenOptions && onOpenOptions(post)}
        />
      </View>

      <PostContent
        content={post.content}
        onPress={() => {
          if (post.content?.mediaType !== 'none') {
            console.log("Ouvrir le visualiseur de media plein ecran");
          }
        }}
      />

      <View style={styles.internalPadding}>
        <PostActions
          likesCount={likesFormatted}
          commentsCount={commentsFormatted}
          sharesCount={sharesFormatted}
          isLikedByMe={post.isLikedByMe}
          onCommentPress={() => onOpenComments && onOpenComments(post)}
          onSharePress={() => onOpenShare && onOpenShare(post)}
          onLikePress={() => onLike && onLike(post._id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    paddingTop: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  repostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 6,
  },
  repostText: {
    fontSize: 12,
    fontWeight: '600',
  },
  internalPadding: {
    paddingHorizontal: 16,
  }
});