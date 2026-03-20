import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedHeader from '../../components/navigation/AnimatedHeader';
import { useAppTheme } from '../../theme/theme';

export default function FeedScreen({ navigation }) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const mockData = Array.from({ length: 20 }, (_, i) => ({ id: i.toString(), title: `Publication test numéro ${i + 1}` }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedHeader scrollY={scrollY} title="Pour Toi" navigation={navigation} />
      
      <Animated.FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 140 + insets.top, 
          paddingBottom: 100, 
          paddingHorizontal: 16,
        }}
        renderItem={({ item }) => (
          <View style={[styles.mockCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
            <Text style={{ color: theme.colors.textMuted, marginTop: 8 }}>
              Le contenu de la publication s'affichera ici avec le composant de carte finalisé.
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mockCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#5170FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
});