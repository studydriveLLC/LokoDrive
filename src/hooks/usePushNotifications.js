//src/hooks/usePushNotifications.js
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useSelector } from 'react-redux';
import { useRegisterPushTokenMutation } from '../store/api/notificationApiSlice';

export const usePushNotifications = () => {
  const { user } = useSelector((state) => state.auth);
  const [registerToken] = useRegisterPushTokenMutation();

  useEffect(() => {
    if (!user) return; 

    const registerForPushNotificationsAsync = async () => {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.log('[Push] Permission refusee pour les notifications');
          return;
        }

        // C'est ici qu'on recupere le vrai token FCM/APNs et non le token des serveurs d'Expo
        const tokenData = await Notifications.getDevicePushTokenAsync();
        const token = tokenData.data;

        if (token) {
          await registerToken(token).unwrap();
          console.log('[Push] Token FCM enregistre avec succes en BDD');
        }
      } catch (error) {
        console.log('[Push] Erreur lors de la recuperation du token push :', error);
      }
    };

    registerForPushNotificationsAsync();
  }, [user, registerToken]);
};