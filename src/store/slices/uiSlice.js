// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    errorToast: {
      isVisible: false,
      message: '',
    },
    successToast: {
      isVisible: false,
      message: '',
    },
    scrollState: {} 
  },
  reducers: {
    showErrorToast: (state, action) => {
      state.errorToast.isVisible = true;
      state.errorToast.message = action.payload.message || 'Une erreur est survenue.';
    },
    hideErrorToast: (state) => {
      state.errorToast.isVisible = false;
      state.errorToast.message = '';
    },
    showSuccessToast: (state, action) => {
      state.successToast.isVisible = true;
      state.successToast.message = action.payload.message || 'Action reussie.';
    },
    hideSuccessToast: (state) => {
      state.successToast.isVisible = false;
      state.successToast.message = '';
    },
    setScreenScrolled: (state, action) => {
      const { screenName, isScrolled } = action.payload;
      if (!state.scrollState[screenName]) {
        state.scrollState[screenName] = { isScrolled: false, trigger: 0 };
      }
      state.scrollState[screenName].isScrolled = isScrolled;
    },
    triggerScrollToTop: (state, action) => {
      const { screenName } = action.payload;
      if (!state.scrollState[screenName]) {
        state.scrollState[screenName] = { isScrolled: false, trigger: 0 };
      }
      state.scrollState[screenName].trigger += 1; 
    }
  }
});

export const { 
  showErrorToast, 
  hideErrorToast, 
  showSuccessToast, 
  hideSuccessToast,
  setScreenScrolled,
  triggerScrollToTop
} = uiSlice.actions;

export default uiSlice.reducer;