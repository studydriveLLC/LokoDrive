// Bouchon temporaire pour eviter les crashs de l'apiSlice
const socketService = {
  disconnect: () => console.log('[Socket] Disconnect demande par API Slice'),
  updateToken: (token) => console.log('[Socket] Token mis a jour'),
};
export default socketService;