// src/components/feed/ReportPostModal.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Image, ScrollView } from 'react-native';
import { AlertTriangle, CheckCircle2, Circle, CheckCircle, Camera, X } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import BottomSheet from '../ui/BottomSheet';
import { useAppTheme } from '../../theme/theme';
import { useCreateReportMutation } from '../../store/api/reportApiSlice';
import { showSuccessToast } from '../../store/slices/uiSlice';

const REASONS = [
  "Contenu haineux ou violent",
  "Spam ou arnaque",
  "Harcèlement",
  "Nudité ou contenu sexuel",
  "Fausse information",
  "Autre raison"
];

export default function ReportPostModal({ visible, onClose, post }) {
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const [createReport, { isLoading }] = useCreateReportMutation();

  const [selectedReason, setSelectedReason] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (visible) {
      setSelectedReason(null);
      setScreenshots([]);
      setIsSuccess(false);
      setErrorMsg('');
    }
  }, [visible]);

  const pickImage = async () => {
    if (screenshots.length >= 3) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setScreenshots([...screenshots, result.assets[0]]);
    }
  };

  const removeScreenshot = (index) => {
    const newScreenshots = [...screenshots];
    newScreenshots.splice(index, 1);
    setScreenshots(newScreenshots);
  };

  const handleReport = async () => {
    if (!selectedReason || !post) return;
    setErrorMsg('');

    const formData = new FormData();
    formData.append('postId', post._id);
    formData.append('reason', selectedReason);

    screenshots.forEach((photo, index) => {
      formData.append('screenshots', {
        name: `screenshot_${index}.jpg`,
        type: 'image/jpeg',
        uri: photo.uri,
      });
    });

    try {
      await createReport(formData).unwrap();
      setIsSuccess(true);
      dispatch(showSuccessToast({ message: "Signalement envoye avec succes" }));
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setErrorMsg(error?.data?.message || "Erreur lors de l'envoi du signalement.");
    }
  };

  const renderFooter = () => (
    <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.divider }]}>
      {errorMsg ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMsg}</Text> : null}
      <Pressable 
        style={[styles.submitButton, { backgroundColor: selectedReason ? theme.colors.error : theme.colors.border }]}
        disabled={!selectedReason || isLoading || isSuccess}
        onPress={handleReport}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : isSuccess ? (
          <View style={styles.successRow}>
            <CheckCircle2 color="#FFFFFF" size={20} />
            <Text style={styles.successText}>Signalement recu</Text>
          </View>
        ) : (
          <Text style={[styles.submitText, { color: selectedReason ? '#FFFFFF' : theme.colors.textDisabled }]}>
            Envoyer le signalement
          </Text>
        )}
      </Pressable>
    </View>
  );

  return (
    <BottomSheet isVisible={visible} onClose={onClose} footer={renderFooter()}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <AlertTriangle color={theme.colors.error} size={24} style={{ marginRight: 10 }} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Signaler la publication</Text>
        </View>
        
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Aidez-nous a garder LokoNet securise. Pourquoi signalez-vous la publication de {post?.author?.pseudo} ?
        </Text>

        <View style={styles.listContainer}>
          {REASONS.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <Pressable 
                key={reason} 
                style={[styles.reasonRow, { backgroundColor: isSelected ? 'rgba(235, 87, 87, 0.05)' : theme.colors.surface }]}
                onPress={() => !isLoading && !isSuccess && setSelectedReason(reason)}
              >
                <Text style={[styles.reasonText, { color: theme.colors.text, fontWeight: isSelected ? '700' : '500' }]}>
                  {reason}
                </Text>
                {isSelected ? (
                  <CheckCircle color={theme.colors.error} size={22} />
                ) : (
                  <Circle color={theme.colors.textDisabled} size={22} />
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.screenshotsSection}>
          <Text style={[styles.screenshotTitle, { color: theme.colors.text }]}>Preuves (Optionnel, max 3)</Text>
          <View style={styles.screenshotsContainer}>
            {screenshots.map((shot, index) => (
              <View key={index} style={styles.screenshotWrapper}>
                <Image source={{ uri: shot.uri }} style={styles.screenshotPreview} />
                <Pressable style={styles.removeScreenshot} onPress={() => removeScreenshot(index)}>
                  <X color="#FFF" size={14} />
                </Pressable>
              </View>
            ))}
            {screenshots.length < 3 && (
              <Pressable style={[styles.addScreenshotBtn, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight }]} onPress={pickImage}>
                <Camera color={theme.colors.primaryDark} size={24} />
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  listContainer: { gap: 12, marginBottom: 24 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: 'transparent' },
  reasonText: { fontSize: 15 },
  screenshotsSection: { marginTop: 10 },
  screenshotTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  screenshotsContainer: { flexDirection: 'row', gap: 12 },
  screenshotWrapper: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  screenshotPreview: { width: '100%', height: '100%' },
  removeScreenshot: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 4 },
  addScreenshotBtn: { width: 80, height: 80, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  footer: { padding: 16, borderTopWidth: 1 },
  submitButton: { height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  submitText: { fontSize: 16, fontWeight: '700' },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  successText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  errorText: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 10 },
});