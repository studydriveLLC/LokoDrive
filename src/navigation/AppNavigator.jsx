import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getToken } from '../store/secureStoreAdapter';
import { setCredentials, setAuthLoading } from '../store/slices/authSlice';
import { useAppTheme } from '../theme/theme';

import LandingPage from '../screens/auth/LandingPage';
import LoginPage from '../screens/auth/LoginPage';
import RegisterPage from '../screens/auth/RegisterPage';
import MainTabNavigator from './MainTabNavigator';
import MenuScreen from '../screens/profile/MenuScreen';
import ErrorToast from '../components/ui/ErrorToast';
import TopInsetBox from '../components/ui/TopInsetBox';

const Stack = createStackNavigator();

const fastSpringConfig = {
  animation: 'spring',
  config: {
    stiffness: 1500,
    damping: 150,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export default function AppNavigator() {
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken('accessToken');
        if (token) {
          // Restaure le token et fetche le profil utilisateur
          const profileResponse = await fetch(`${rawBaseUrl}/v1/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            dispatch(
              setCredentials({
                user: profileData.data?.user || profileData.data,
                token,
              })
            );
          } else {
            dispatch(setCredentials({ user: null, token: null }));
          }
        }
      } catch (error) {
        console.error('Erreur restoration session', error);
      } finally {
        dispatch(setAuthLoading(false));
      }
    };
    checkToken();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.mainWrapper, { backgroundColor: theme.colors.background }]}>
        <TopInsetBox />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: fastSpringConfig,
              close: fastSpringConfig,
            },
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Landing" component={LandingPage} />
              <Stack.Screen name="Register" component={RegisterPage} />
              <Stack.Screen name="Login" component={LoginPage} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabNavigator} />
              <Stack.Screen
                name="Menu"
                component={MenuScreen}
                options={{
                  gestureEnabled: false,
                  cardStyle: { backgroundColor: theme.colors.background },
                }}
              />
            </>
          )}
        </Stack.Navigator>
        <ErrorToast />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
});