import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatsReducer from './slices/chatsSlice';
import uiReducer from './slices/uiSlice';

// Safely read persisted auth state on the client only
function loadPersistedAuth() {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    // basic shape check
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'isAuthenticated' in parsed &&
      'user' in parsed
    ) {
      return parsed;
    }
  } catch (_) {
    // ignore corrupted data
  }
  return undefined;
}

// Safely read persisted chats state on the client only
function loadPersistedChats() {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem('chats');
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'chats' in parsed &&
      'messages' in parsed
    ) {
      return parsed;
    }
  } catch (_) {
    // ignore corrupted data
  }
  return undefined;
}

const preloadedState = typeof window !== 'undefined'
  ? { auth: loadPersistedAuth(), chats: loadPersistedChats() }
  : undefined;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    ui: uiReducer,
  },
  // Only provide preloadedState on the client
  preloadedState: preloadedState as any,
});

// Persist auth slice on the client
if (typeof window !== 'undefined') {
  try {
    store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem('auth', JSON.stringify(state.auth));
      localStorage.setItem('chats', JSON.stringify(state.chats));
    });
  } catch (_) {
    // Ignore persistence errors (e.g., private mode)
  }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

