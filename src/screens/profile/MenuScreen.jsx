import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Settings, Bell, ShieldQuestion, UserCheck, LogOut } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';

import MenuItem from '../../components/profile/MenuItem';
import EditProfileModal from '../../components/profile/EditProfileModal';
import LogoutModal from '../../components/profile/LogoutModal';
import { useAppTheme } from '../../theme/theme';

import { useUpdateProfileMutation, useLogoutMutation } from '../../store/api/authApiSlice';
import { updateUser, logout } from '../../store/slices/authSlice';

export default function MenuScreen({ navigation }) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  // 1. Récupération de l'utilisateur réel depuis Redux
  const user = useSelector((state) => state.auth.user);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // 2. Initialisation des mutations API
  const [updateProfileApi, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logoutApi] = useLogoutMutation();

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Appel réseau
      const response = await updateProfileApi(updatedData).unwrap();
      
      // Mise à jour de l'état global avec les nouvelles données du serveur
      // On anticipe la structure de réponse : data.user (sinon fallback sur updatedData)
      const newUserData = response.data?.user || updatedData;
      dispatch(updateUser(newUserData));
      
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      // Ici, on pourrait déclencher un composant ErrorToast si tu en as un
    }
  };

  const handleConfirmLogout = async () => {
    try {
      // Invalidation du token côté serveur (cookie refreshToken)
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Erreur serveur lors de la déconnexion, forçage local.", error);
    } finally {
      // Nettoyage critique côté client quoi qu'il arrive
      try {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      } catch (storeError) {
        console.error("Erreur lors du nettoyage du SecureStore", storeError);
      }
      
      // Réinitialisation de l'état Redux (déclenche la redirection auto vers Login)
      dispatch(logout());
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={15}>
          <ArrowLeft color={theme.colors.text} size={28} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Menu</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.profileInfoRow}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primaryLight }]}>
              <Text style={{ color: theme.colors.primaryDark, fontSize: 24, fontWeight: '700' }}>
                {user?.pseudo ? user.pseudo[0].toUpperCase() : 'K'}
              </Text>
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={[styles.pseudo, { color: theme.colors.text }]}>
                {user?.pseudo || 'Utilisateur'}
              </Text>
              <Text style={[styles.email, { color: theme.colors.textMuted }]}>
                {user?.email || 'Email non renseigné'}
              </Text>
            </View>
          </View>
          
          <Pressable 
            style={[styles.editButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={[styles.editButtonText, { color: theme.colors.text }]}>Modifier le profil</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>Préférences</Text>
        <View style={[styles.menuBlock, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <MenuItem icon={<Settings color={theme.colors.primaryDark} size={20} />} label="Paramètres du compte" onPress={() => console.log("Paramètres")} />
          <MenuItem icon={<Bell color={theme.colors.primaryDark} size={20} />} label="Notifications" onPress={() => console.log("Notifications")} />
          <MenuItem icon={<UserCheck color={theme.colors.primaryDark} size={20} />} label="Confidentialité" onPress={() => console.log("Confidentialité")} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>Assistance</Text>
        <View style={[styles.menuBlock, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <MenuItem icon={<ShieldQuestion color={theme.colors.primaryDark} size={20} />} label="Aide et Support" onPress={() => console.log("Aide")} />
        </View>

        <View style={styles.logoutContainer}>
          <MenuItem 
            icon={<LogOut color={theme.colors.error} size={20} />} 
            label="Se déconnecter" 
            isDestructive={true} 
            onPress={() => setIsLogoutModalVisible(true)} 
          />
        </View>
      </ScrollView>

      {/* Modal d'édition du profil avec gestion de l'état de chargement */}
      <EditProfileModal 
        visible={isEditModalVisible} 
        onClose={() => setIsEditModalVisible(false)} 
        currentUser={user}
        onSave={handleUpdateProfile}
        isLoading={isUpdating}
      />

      {/* Modal de confirmation de déconnexion */}
      <LogoutModal
        visible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={handleConfirmLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileCard: { borderRadius: 24, padding: 20, borderWidth: 1, marginBottom: 30, marginTop: 10 },
  profileInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarPlaceholder: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  profileTextContainer: { flex: 1 },
  pseudo: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  email: { fontSize: 14, fontWeight: '500' },
  editButton: { paddingVertical: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  editButtonText: { fontSize: 15, fontWeight: '700' },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginLeft: 16, marginBottom: 8, marginTop: 10 },
  menuBlock: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  logoutContainer: { marginTop: 20, borderRadius: 20, overflow: 'hidden' }
});