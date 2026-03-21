import { io } from 'socket.io-client';
import { getToken } from '../store/secureStoreAdapter';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL;
let socket = null;

const socketService = {
  connect: async () => {
    if (socket) return socket;
    
    const token = await getToken('accessToken');
    
    socket = io(rawBaseUrl, {
      auth: { token },
      transports: ['websocket'],
    });
    
    socket.on('connect', () => console.log('[Socket] Connecte au serveur'));
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