//src/components/ressources/card/ResourceAuthor.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import RoleBadge from '../../ui/RoleBadge';
import { useAppTheme } from '../../../theme/theme';
import { 
  useGetFollowStatusQuery, 
  useFollowUserMutation, 
  useUnfollowUserMutation 
} from '../../../store/api/socialApiSlice';

const timeAgo = (dateInput) => {
  if (!dateInput) return '';
  const seconds = Math.floor((new Date() - new Date(dateInput)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' an(s)';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' mois';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' j';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' h';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' min';
  return "A l'instant";
};

export default function ResourceAuthor({ user, createdAt }) {
  const theme = useAppTheme();
  const currentUser = useSelector((state) => state.auth.user);
  const [relativeTime, setRelativeTime] = useState(timeAgo(createdAt));

  const isMe = currentUser?._id === user?._id;

  // Requete automatique au montage pour connaitre l'etat (S'abonner / Abonne)
  const { data: statusData, isLoading: isStatusLoading } = useGetFollowStatusQuery(user?._id, {
    skip: !user?._id || isMe,
  });
  
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation();

  const isFollowed = statusData?.data?.isFollowing || false;
  
  // isActionLoading ne concerne DESORMAIS que le vrai clic utilisateur
  const isActionLoading = isFollowing || isUnfollowing;

  useEffect(() => {
    setRelativeTime(timeAgo(createdAt)); 
    const intervalId = setInterval(() => {
      setRelativeTime(timeAgo(createdAt));
    }, 60000);
    return () => clearInterval(intervalId);
  }, [createdAt]);

  const handleToggleFollow = async () => {
    // Si ca charge (statut ou action), on bloque le clic par securite
    if (isActionLoading || isStatusLoading || !user?._id) return;
    try {
      if (isFollowed) {
        await unfollowUser(user._id).unwrap();
      } else {
        await followUser(user._id).unwrap();
      }
    } catch (error) {
      console.error("Erreur lors de l'action d'abonnement :", error);
    }
  };
  
  if (!user) return null;
  const avatarUrl = user.avatar || 'https://ui-avatars.com/api/?name=User&background=random';

  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.pseudo, { color: theme.colors.text }]} numberOfLines={1}>
            {user.pseudo || 'Utilisateur anonyme'}
          </Text>
          <RoleBadge role={user.role} isVerified={user.isVerified} customBadge={user.badge} size={14} />
        </View>
        <Text style={[styles.date, { color: theme.colors.textMuted }]}>
          {relativeTime}
        </Text>
      </View>

      {!isMe && (
        <Pressable 
          style={[
            styles.followButton, 
            { 
              backgroundColor: isFollowed ? 'transparent' : theme.colors.primary,
              borderColor: isFollowed ? theme.colors.border : theme.colors.primary,
              opacity: isStatusLoading ? 0.6 : 1 // Opacite reduite pendant la requete invisible
            }
          ]}
          onPress={handleToggleFollow}
          disabled={isActionLoading || isStatusLoading}
        >
          {/* Le spinner n'apparait QUE si l'utilisateur clique */}
          {isActionLoading ? (
            <ActivityIndicator size="small" color={isFollowed ? theme.colors.text : '#fff'} />
          ) : (
            <Text style={[
              styles.followButtonText, 
              { color: isFollowed ? theme.colors.text : '#fff' }
            ]}>
              {/* UX amelioree : 3 petits points pendant que l'app cherche le statut */}
              {isStatusLoading ? '...' : (isFollowed ? 'Abonne' : "S'abonner")}
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: '#E1E8ED' },
  textContainer: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  pseudo: { fontSize: 14, fontWeight: '700' },
  date: { fontSize: 12, marginTop: 2 },
  followButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center', minWidth: 85 },
  followButtonText: { fontSize: 12, fontWeight: '700' }
});