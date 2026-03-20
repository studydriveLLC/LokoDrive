import React from 'react';
import { View, StyleSheet } from 'react-native';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import { useAppTheme } from '../../theme/theme';

export default function PostCard({ post }) {
  const theme = useAppTheme();

  const handleReadMore = () => {
    console.log("Ouvrir la modale LiquidGlass pour lire toute la description");
    // TODO: Connecter à la LiquidModal de description
  };

  const handleCommentPress = () => {
    console.log("Ouvrir la modale de commentaires glissante vers le haut");
    // TODO: Connecter à la modale de commentaires
  };

  const handleSharePress = () => {
    console.log("Ouvrir la modale de partage (App ou Ailleurs)");
    // TODO: Connecter à la modale de partage
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      
      <PostHeader 
        author={post.author} 
        date={post.date} 
        description={post.description} 
        onReadMore={handleReadMore}
      />

      {/* Zone réservée au contenu média (Image/Vidéo/Texte seul) que nous ferons plus tard */}
      {/* <PostContent media={post.media} /> */}

      <PostActions 
        likesCount={post.likes}
        commentsCount={post.comments}
        sharesCount={post.shares}
        isLikedByMe={post.isLikedByMe}
        onCommentPress={handleCommentPress}
        onSharePress={handleSharePress}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#5170FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
});