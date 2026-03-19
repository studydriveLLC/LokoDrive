import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    errorToast: {
      isVisible: false,
      message: '',
    }
  },
  reducers: {
    showErrorToast: (state, action) => {
      state.errorToast.isVisible = true;
      state.errorToast.message = action.payload.message || 'Une erreur est survenue.';
    },
    hideErrorToast: (state) => {
      state.errorToast.isVisible = false;
      state.errorToast.message = '';
    }
  }
});

export const { showErrorToast, hideErrorToast } = uiSlice.actions;
export default uiSlice.reducer;