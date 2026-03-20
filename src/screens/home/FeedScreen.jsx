import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, DeviceEventEmitter } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedHeader from '../../components/navigation/AnimatedHeader';
import { useAppTheme } from '../../theme/theme';

export default function FeedScreen({ navigation }) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  
  const listRef = useRef(null);
  const savedScrollPosition = useRef(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('SMART_TAB_PRESS', (event) => {
      if (event.routeName !== 'PourToi') return;

      if (scrollY.value > 100) {
        // L'utilisateur est bas dans la page : on sauvegarde et on remonte
        savedScrollPosition.current = scrollY.value;
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      } else if (savedScrollPosition.current > 100) {
        // L'utilisateur est en haut et a une sauvegarde : on le redescend où il était
        listRef.current?.scrollToOffset({ offset: savedScrollPosition.current, animated: true });
        savedScrollPosition.current = 0; // On réinitialise après utilisation
      } else {
        // L'utilisateur est en haut sans sauvegarde : on rafraîchit
        triggerRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    // Simulation d'un appel API de rafraîchissement
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const mockData = Array.from({ length: 20 }, (_, i) => ({ id: i.toString(), title: `Publication test numéro ${i + 1}` }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedHeader scrollY={scrollY} title="Pour Toi" navigation={navigation} />
      
      <Animated.FlatList
        ref={listRef}
        data={mockData}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={triggerRefresh}
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