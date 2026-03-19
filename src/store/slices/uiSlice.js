import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {},
  reducers: {
    showErrorToast: (state, action) => {
      // Pour l'instant on log l'erreur, on fera une belle UI plus tard
      console.error('[TOAST ERROR]', action.payload.message);
    }
  }
});

export const { showErrorToast } = uiSlice.actions;
export default uiSlice.reducer;