export const theme = {
  colors: {
    primary: '#2F80ED', // Bleu principal (style etudiant/productivite)
    primaryDark: '#1D5CBB',
    secondary: '#F2994A', // Orange pour les actions secondaires/badges
    background: '#F8F9FA', // Fond gris tres clair pour reposer les yeux
    surface: '#FFFFFF', // Fond des cartes et des modales
    text: '#333333', // Texte principal sombre (pas totalement noir pour la lisibilite)
    textLight: '#828282', // Texte secondaire (dates, pseudos)
    border: '#E0E0E0', // Bordures des champs de texte et separateurs
    error: '#EB5757', // Rouge pour les erreurs
    success: '#27AE60', // Vert pour les validations
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
    xl: 20,
    round: 9999, // Pour les avatars
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 14, fontWeight: 'normal' },
    small: { fontSize: 12, fontWeight: 'normal' },
  }
};