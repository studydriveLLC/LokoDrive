// src/components/action/CreatePostModal.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { Image as ImageIcon, Link as LinkIcon, BarChart2, Globe, Lock, Check } from 'lucide-react-native';
import BottomSheet from '../ui/BottomSheet';
import { useAppTheme } from '../../theme/theme';
import { useCreatePostMutation } from '../../store/api/postApiSlice';

const MAX_CHARS = 500;
const BACKGROUNDS = ['none', 'primary', 'info', 'success', 'warning', 'error'];

export default function CreatePostModal({ visible, onClose }) {
  const theme = useAppTheme();
  const [postText, setPostText] = useState('');
  const [textBackground, setTextBackground] = useState('none');
  const [isPublic, setIsPublic] = useState(true);
  
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handlePublish = async () => {
    if (!postText.trim()) return;
    
    try {
      await createPost({
        text: postText.trim(),
        textBackground: textBackground,
        mediaType: 'none',
        mediaUrls: []
      }).unwrap();
      
      setPostText('');
      setTextBackground('none');
      Keyboard.dismiss();
      onClose();
    } catch (error) {
      console.log('Erreur de publication:', error);
    }
  };

  const renderBackgroundSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bgSelector}>
      {BACKGROUNDS.map((bg) => {
        const bgColor = bg === 'none' ? theme.colors.surface : theme.colors[bg];
        const isSelected = textBackground === bg;
        return (
          <Pressable
            key={bg}
            onPress={() => setTextBackground(bg)}
            style={[
              styles.bgCircle,
              { backgroundColor: bgColor, borderColor: theme.colors.border },
              isSelected && styles.bgCircleSelected
            ]}
          >
            {isSelected && <Check color={bg === 'none' ? theme.colors.primary : theme.colors.surface} size={16} />}
          </Pressable>
        );
      })}
    </ScrollView>
  );

  const renderFooter = () => (
    <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.divider }]}>
      <View style={styles.mediaActions}>
        <Pressable style={styles.mediaButton} hitSlop={10}>
          <ImageIcon color={theme.colors.primary} size={22} />
        </Pressable>
        <Pressable style={styles.mediaButton} hitSlop={10}>
          <LinkIcon color={theme.colors.primary} size={22} />
        </Pressable>
        <Pressable style={styles.mediaButton} hitSlop={10}>
          <BarChart2 color={theme.colors.primary} size={22} />
        </Pressable>
      </View>
      
      <View style={styles.publishContainer}>
        <Text style={[styles.charCount, { 
          color: postText.length > MAX_CHARS - 50 ? theme.colors.error : theme.colors.textMuted 
        }]}>
          {postText.length}/{MAX_CHARS}
        </Text>
        
        <Pressable 
          style={[styles.publishButton, { backgroundColor: postText.trim() && !isLoading ? theme.colors.primary : theme.colors.primaryLight }]}
          disabled={!postText.trim() || isLoading}
          onPress={handlePublish}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.surface} />
          ) : (
            <Text style={[styles.publishText, { color: postText.trim() ? theme.colors.surface : theme.colors.textDisabled }]}>
              Publier
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );

  return (
    <BottomSheet isVisible={visible} onClose={onClose} footer={renderFooter()}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Nouvelle publication</Text>
        
        <View style={styles.postBody}>
          <View style={styles.avatarColumn}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primaryLight }]}>
              <Text style={{ color: theme.colors.primaryDark, fontWeight: '700', fontSize: 16 }}>M</Text>
            </View>
            <View style={[styles.verticalLine, { backgroundColor: theme.colors.border }]} />
          </View>
          
          <View style={styles.inputColumn}>
            <View style={styles.authorHeader}>
              <Text style={[styles.authorName, { color: theme.colors.text }]}>Moi</Text>
              
              <Pressable 
                style={[styles.visibilityPill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => setIsPublic(!isPublic)}
              >
                {isPublic ? <Globe color={theme.colors.textMuted} size={12} /> : <Lock color={theme.colors.textMuted} size={12} />}
                <Text style={[styles.visibilityText, { color: theme.colors.textMuted }]}>
                  {isPublic ? 'Public' : 'Abonnes'}
                </Text>
              </Pressable>
            </View>
            
            <TextInput
              style={[
                styles.textInput, 
                { color: textBackground === 'none' ? theme.colors.text : theme.colors.surface },
                textBackground !== 'none' && { backgroundColor: theme.colors[textBackground], padding: 16, borderRadius: 12 }
              ]}
              placeholder="Que se passe-t-il ?"
              placeholderTextColor={textBackground === 'none' ? theme.colors.textDisabled : 'rgba(255,255,255,0.7)'}
              multiline={true}
              maxLength={MAX_CHARS}
              autoFocus={true} 
              scrollEnabled={false}
              value={postText}
              onChangeText={setPostText}
            />
            
            {renderBackgroundSelector()}
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 24 },
  postBody: { flexDirection: 'row' },
  avatarColumn: { alignItems: 'center', marginRight: 12 },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  verticalLine: { width: 2, flex: 1, marginTop: 8, borderRadius: 1 },
  inputColumn: { flex: 1, paddingBottom: 10 },
  authorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  authorName: { fontSize: 16, fontWeight: '700', marginRight: 10 },
  visibilityPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, gap: 4 },
  visibilityText: { fontSize: 11, fontWeight: '600' },
  textInput: { fontSize: 17, lineHeight: 24, minHeight: 120, paddingTop: 0, paddingBottom: 10, textAlignVertical: 'top' },
  bgSelector: { marginTop: 12, flexDirection: 'row', paddingVertical: 4 },
  bgCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  bgCircleSelected: { borderWidth: 2, transform: [{ scale: 1.1 }] },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1 },
  mediaActions: { flexDirection: 'row', gap: 16 },
  mediaButton: { padding: 4 },
  publishContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  charCount: { fontSize: 12, fontWeight: '600' },
  publishButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  publishText: { fontWeight: '700', fontSize: 15 },
});