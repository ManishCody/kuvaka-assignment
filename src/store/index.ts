import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatsReducer from "./slices/chatsSlice";
import uiReducer from "./slices/uiSlice";
import type { AuthState } from "./slices/authSlice";
import type { ChatsState } from "./slices/chatsSlice";

// Safely read persisted auth state on the client only
function loadPersistedAuth() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    // basic shape check
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "isAuthenticated" in parsed &&
      "user" in parsed
    ) {
      return parsed;
    }
  } catch {
    // ignore corrupted data
  }
  return undefined;
}

// Safely read persisted chats state on the client only
function loadPersistedChats() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("chats");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "chats" in parsed &&
      "messages" in parsed
    ) {
      return parsed;
    }
  } catch {
    // ignore corrupted data
  }
  return undefined;
}

import chatsInitialState from "./slices/chatsSlice";
import authInitialState from "./slices/authSlice";

const preloadedState: { auth: AuthState; chats: ChatsState } | undefined =
  typeof window !== "undefined"
    ? {
        auth: loadPersistedAuth() ?? authInitialState,
        chats: loadPersistedChats() ?? chatsInitialState,
      }
    : undefined;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    ui: uiReducer,
  },
  // Only provide preloadedState on the client
  preloadedState: preloadedState,
});

// Persist auth slice on the client
if (typeof window !== "undefined") {
  try {
    store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem("auth", JSON.stringify(state.auth));
      localStorage.setItem("chats", JSON.stringify(state.chats));
    });
  } catch {
    // Ignore persistence errors (e.g., private mode)
  }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
