import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../store/api/authApiSlice';
import { setCredentials } from '../../store/slices/authSlice';
import { showErrorToast } from '../../store/slices/uiSlice';
import { saveToken } from '../../store/secureStoreAdapter';
import { theme } from '../../theme/theme';
import AnimatedInput from '../../components/ui/AnimatedInput';
import AnimatedButton from '../../components/ui/AnimatedButton';

export default function RegisterPage({ navigation }) {
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pseudo: '',
    phone: '',
    email: '',
    university: '',
    password: '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const { firstName, lastName, pseudo, phone, email, university, password } = formData;
    
    if (!firstName.trim() || !lastName.trim() || !pseudo.trim() || !phone.trim() || !email.trim() || !university.trim() || !password.trim()) {
      dispatch(showErrorToast({ message: 'Veuillez remplir tous les champs.' }));
      return;
    }

    try {
      const response = await register(formData).unwrap();
      const { accessToken, user } = response.data;

      await saveToken('accessToken', accessToken);
      dispatch(setCredentials({ user, token: accessToken }));

    } catch (error) {
      console.error('Erreur inscription:', error);
      const errorMessage = error?.data?.errors?.[0]?.message || error?.data?.message || 'Erreur lors de l\'inscription.';
      dispatch(showErrorToast({ message: errorMessage }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Rejoindre StudyDrive</Text>
          <Text style={styles.subtitle}>Créez votre compte étudiant.</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <AnimatedInput label="Prénom" value={formData.firstName} onChangeText={(val) => handleChange('firstName', val)} />
          </View>
          <View style={styles.halfInputContainer}>
            <AnimatedInput label="Nom" value={formData.lastName} onChangeText={(val) => handleChange('lastName', val)} />
          </View>
        </View>

        <AnimatedInput label="Pseudo" value={formData.pseudo} onChangeText={(val) => handleChange('pseudo', val)} autoCapitalize="none" />
        <AnimatedInput label="Email" value={formData.email} onChangeText={(val) => handleChange('email', val)} keyboardType="email-address" autoCapitalize="none" />
        <AnimatedInput label="Téléphone" value={formData.phone} onChangeText={(val) => handleChange('phone', val)} keyboardType="phone-pad" />
        <AnimatedInput label="Université" value={formData.university} onChangeText={(val) => handleChange('university', val)} />
        <AnimatedInput label="Mot de passe" value={formData.password} onChangeText={(val) => handleChange('password', val)} secureTextEntry={true} />

        <View style={styles.actionContainer}>
          <AnimatedButton title="S'inscrire" onPress={handleRegister} isLoading={isLoading} />
        </View>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxxl,
  },
  header: {
    marginBottom: theme.spacing.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.m, // Utilisation de gap pour espacer proprement
  },
  halfInputContainer: {
    flex: 1,
  },
  actionContainer: {
    marginTop: theme.spacing.s,
  },
  linkButton: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
    padding: theme.spacing.s,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
  }
});