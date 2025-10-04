import { configureStore } from "@reduxjs/toolkit";
import authReducer, { authInitialState } from "./slices/authSlice";
import chatsReducer, { chatsInitialState, hydrate } from "./slices/chatsSlice";
import uiReducer from "./slices/uiSlice";
import type { AuthState } from "./slices/authSlice";
import type { ChatsState } from "./slices/chatsSlice";

function loadPersistedAuth() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "isAuthenticated" in parsed &&
      "user" in parsed
    ) {
      return parsed;
    }
  } catch {}
  return undefined;
}

function loadPersistedChatsForPhone(phone?: string | null) {
  if (typeof window === "undefined") return undefined;
  const key = phone ? `chats:${phone}` : "chats:guest";
  try {
    const raw = localStorage.getItem(key);
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
  } catch {}
  return undefined;
}

// use the named initial states exported by slices

const preloadedState: { auth: AuthState; chats: ChatsState } | undefined =
  typeof window !== "undefined"
    ? (() => {
        const auth = loadPersistedAuth() ?? authInitialState;
        const phone = auth?.user?.phone ?? null;
        const chats = loadPersistedChatsForPhone(phone) ?? chatsInitialState;
        return { auth, chats };
      })()
    : undefined;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    ui: uiReducer,
  },
  preloadedState: preloadedState,
});

if (typeof window !== "undefined") {
  try {
    let persistTimer: number | undefined;
    let lastPhone: string | null | undefined = undefined;
    const persist = () => {
      const state = store.getState();
      try {
        localStorage.setItem("auth", JSON.stringify(state.auth));
        const phone = state.auth.user?.phone ?? null;
        const key = phone ? `chats:${phone}` : "chats:guest";
        localStorage.setItem(key, JSON.stringify(state.chats));
      } catch {
        // ignore quota or serialization errors
      }
    };
    store.subscribe(() => {
      if (persistTimer) window.clearTimeout(persistTimer);
      // Debounce writes to 200ms
      persistTimer = window.setTimeout(persist, 200);

      // If phone changed, rehydrate chats from the correct namespace
      const state = store.getState();
      const currentPhone = state.auth.user?.phone ?? null;
      if (currentPhone !== lastPhone) {
        lastPhone = currentPhone;
        const loaded = loadPersistedChatsForPhone(currentPhone) ?? chatsInitialState;
        store.dispatch(hydrate(loaded));
      }
    });
  } catch {
    // Ignore persistence errors (e.g., private mode)
  }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

