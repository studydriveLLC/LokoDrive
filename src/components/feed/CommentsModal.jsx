// src/components/feed/CommentsModal.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Keyboard } from 'react-native';
import { Send, X } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import BottomSheet from '../ui/BottomSheet';
import CommentItem from './CommentItem';
import { useAddCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation } from '../../store/api/postApiSlice';
import { useAppTheme } from '../../theme/theme';

const formatCommentTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diffMs = new Date() - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "A l'instant";
  if (diffMins < 60) return `Il y a ${diffMins}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export default function CommentsModal({ visible, onClose, post }) {
  const theme = useAppTheme();
  const currentUser = useSelector((state) => state.auth.user);
  
  const [inputText, setInputText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);

  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const comments = post?.comments || [];
  const isProcessing = isAdding || isUpdating;

  const handleSend = async () => {
    if (!inputText.trim() || !post?._id) return;
    Keyboard.dismiss();

    try {
      if (editingCommentId) {
        await updateComment({ postId: post._id, commentId: editingCommentId, text: inputText.trim() }).unwrap();
        setEditingCommentId(null);
      } else {
        await addComment({ postId: post._id, text: inputText.trim() }).unwrap();
      }
      setInputText('');
    } catch (error) {
      console.log('Erreur traitement commentaire:', error);
    }
  };

  const handleEditRequest = (comment) => {
    setEditingCommentId(comment.id);
    setInputText(comment.text);
  };

  const handleDeleteRequest = async (commentId) => {
    try {
      await deleteComment({ postId: post._id, commentId }).unwrap();
    } catch (error) {
      console.log('Erreur suppression:', error);
    }
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setInputText('');
    Keyboard.dismiss();
  };

  const renderInputFooter = () => (
    <View style={[styles.footerWrapper, { backgroundColor: theme.colors.background }]}>
      {editingCommentId && (
        <View style={[styles.editBanner, { backgroundColor: theme.colors.primaryLight }]}>
          <Text style={[styles.editBannerText, { color: theme.colors.primaryDark }]}>Modification du commentaire</Text>
          <Pressable onPress={cancelEdit}><X color={theme.colors.primaryDark} size={16} /></Pressable>
        </View>
      )}
      <View style={[styles.inputContainer, { borderTopColor: theme.colors.divider }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Ajouter un commentaire..."
          placeholderTextColor={theme.colors.textDisabled}
          value={inputText}
          onChangeText={setInputText}
          multiline
          editable={!isProcessing}
        />
        <Pressable
          style={[styles.sendButton, { backgroundColor: inputText.trim() && !isProcessing ? theme.colors.primary : theme.colors.primaryLight }]}
          disabled={!inputText.trim() || isProcessing}
          onPress={handleSend}
        >
          {isProcessing ? <ActivityIndicator size="small" color={theme.colors.surface} /> : <Send color={theme.colors.surface} size={18} />}
        </Pressable>
      </View>
    </View>
  );

  return (
    <BottomSheet isVisible={visible} onClose={onClose} footer={renderInputFooter()}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Commentaires</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{comments.length} reponse(s)</Text>
      </View>

      <View style={styles.commentsList}>
        {comments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>Aucun commentaire pour le moment.</Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textDisabled }]}>Soyez le premier a commenter !</Text>
          </View>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              currentUserId={currentUser?._id}
              onEdit={handleEditRequest}
              onDelete={handleDeleteRequest}
              item={{
                id: comment._id,
                authorId: comment.user?._id,
                author: comment.user?.pseudo || 'Utilisateur',
                text: comment.text,
                time: formatCommentTime(comment.createdAt),
                avatar: comment.user?.avatar || null,
                hasBadge: comment.user?.badgeType !== 'none' && comment.user?.badgeType !== undefined
              }}
            />
          ))
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginVertical: 15 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  commentsList: { paddingHorizontal: 16, maxHeight: 400, paddingBottom: 20 },
  emptyContainer: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 16, fontWeight: '500' },
  emptySubtext: { fontSize: 13, marginTop: 4 },
  footerWrapper: { flexDirection: 'column' },
  editBanner: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  editBannerText: { fontSize: 12, fontWeight: '700' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1 },
  input: { flex: 1, minHeight: 44, maxHeight: 100, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, paddingTop: 10, fontSize: 15 },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 12 }
});