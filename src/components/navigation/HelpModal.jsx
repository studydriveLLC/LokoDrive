import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';
import LiquidModal from '../ui/LiquidModal';
import AnimatedButton from '../ui/AnimatedButton';
import { useAppTheme } from '../../theme/theme';

export default function HelpModal({ visible, onClose, routeName }) {
  const theme = useAppTheme();

  const getHelpContent = () => {
    switch (routeName) {
      case 'Ressources':
        return "Accédez à la base de données des sujets d'examens. Une jauge apparaîtra ici lors de vos téléchargements.";
      case 'PourToi':
        return "Votre fil d'actualité en temps réel. Découvrez les publications de la communauté.";
      case 'Messages':
        return "Vos conversations privées. L'icône vous notifiera des messages urgents non lus.";
      case 'MyWord':
        return "L'éditeur scientifique avec clavier virtuel et injection LaTeX. Sauvegarde automatique toutes les 30s.";
      default:
        return "Fonctionnalité en cours de développement.";
    }
  };

  return (
    <LiquidModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.colors.primaryLight }]}>
          <Info color={theme.colors.primary} size={28} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Onglet {routeName === 'PourToi' ? 'Pour Toi' : routeName}
        </Text>
      </View>
      
      <Text style={[styles.description, { color: theme.colors.textMuted }]}>
        {getHelpContent()}
      </Text>

      <AnimatedButton title="Compris" onPress={onClose} style={styles.button} />
    </LiquidModal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
});