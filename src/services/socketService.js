import { io } from 'socket.io-client';
import { getToken } from '../store/secureStoreAdapter';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || '';

const socketUrl = rawBaseUrl.replace(/\/v1\/?$/, '');
let socket = null;

const socketService = {
  connect: async () => {
    if (socket) return socket;
    
    const token = await getToken('accessToken');
    
    socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });
    
    socket.on('connect', () => console.log('[Socket] Connecte au serveur avec succes'));
    socket.on('connect_error', (err) => console.log('[Socket] Erreur:', err.message));
    
    return socket;
  },
  
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log('[Socket] Deconnecte');
    }
  },
  
  updateToken: (token) => {
    if (socket) {
      socket.auth = { token };
      socket.disconnect().connect();
    }
  }
};

export default socketService;