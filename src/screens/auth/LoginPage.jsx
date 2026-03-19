import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/authApiSlice';
import { setCredentials } from '../../store/slices/authSlice';
import { showErrorToast } from '../../store/slices/uiSlice';
import { saveToken } from '../../store/secureStoreAdapter';
import { theme } from '../../theme/theme';
import AnimatedInput from '../../components/ui/AnimatedInput';
import AnimatedButton from '../../components/ui/AnimatedButton';

export default function LoginPage({ navigation }) {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      dispatch(showErrorToast({ message: 'Veuillez remplir tous les champs.' }));
      return;
    }

    try {
      const response = await login({ identifier, password }).unwrap();
      const { accessToken, user } = response.data;

      await saveToken('accessToken', accessToken);
      dispatch(setCredentials({ user, token: accessToken }));

    } catch (error) {
      console.error('Erreur de connexion:', error);
      dispatch(showErrorToast({ 
        message: error?.data?.message || 'Identifiants incorrects ou erreur serveur.' 
      }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>StudyDrive</Text>
          <Text style={styles.subtitle}>Connectez-vous pour accéder au campus.</Text>
        </View>

        <AnimatedInput
          label="Identifiant (Email, Pseudo, Tel)"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
        />

        <AnimatedInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <View style={styles.actionContainer}>
          <AnimatedButton
            title="Se connecter"
            onPress={handleLogin}
            isLoading={isLoading}
          />
        </View>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.6}
        >
          <Text style={styles.linkText}>Pas encore de compte ? S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
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
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  actionContainer: {
    marginTop: theme.spacing.l,
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