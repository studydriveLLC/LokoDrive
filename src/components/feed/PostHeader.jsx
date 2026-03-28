// src/components/feed/PostHeader.jsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { MoreHorizontal } from 'lucide-react-native';
import { useAppTheme } from '../../theme/theme';

export default function PostHeader({ author, date, description, hideDescription, onReadMore, onOptionsPress }) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          {author?.avatar ? (
            <Image source={{ uri: author.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primaryLight }]}>
              <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>
                {author?.pseudo ? author.pseudo.substring(0, 1).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          
          <View style={styles.metaData}>
            <Text style={[styles.pseudo, { color: theme.colors.text }]}>
              {author?.pseudo || 'Utilisateur'}
              {author?.hasBadge && (
                <Text style={{ color: theme.colors.primary }}> •</Text> 
              )}
            </Text>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>{date}</Text>
          </View>
        </View>

        <Pressable style={styles.optionsButton} onPress={onOptionsPress} hitSlop={10}>
          <MoreHorizontal color={theme.colors.textMuted} size={20} />
        </Pressable>
      </View>

      {/* On masque la description classique si c'est un post avec fond coloré */}
      {!hideDescription && description && description.length > 0 && (
        <Pressable onPress={onReadMore}>
          <Text 
            style={[styles.description, { color: theme.colors.text }]} 
            numberOfLines={3}
          >
            {description}
          </Text>
        </Pressable>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaData: {
    marginLeft: 10,
  },
  pseudo: {
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  optionsButton: {
    padding: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
});