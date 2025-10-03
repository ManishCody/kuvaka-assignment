import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UIState = {
  mobileDrawerOpen: boolean;
  searchQuery: string;
  showHistory: boolean;
};

const initialState: UIState = {
  mobileDrawerOpen: false,
  searchQuery: '',
  showHistory: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileDrawerOpen(state, action: PayloadAction<boolean>) {
      state.mobileDrawerOpen = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setShowHistory(state, action: PayloadAction<boolean>) {
      state.showHistory = action.payload;
    },
    toggleShowHistory(state) {
      state.showHistory = !state.showHistory;
    },
  },
});

export const { setMobileDrawerOpen, setSearchQuery, setShowHistory, toggleShowHistory } = uiSlice.actions;
export default uiSlice.reducer;
