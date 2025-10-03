import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export type Message = {
  id: string;
  chatId: string;
  role: "user" | "ai";
  content: string;
  imageUrl?: string;
  imageUrls?: string[];
  createdAt: string; // ISO timestamp
};

export type Chat = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string; // ISO timestamp
};

export type ChatsState = {
  chats: Chat[];
  messages: Record<string, Message[]>; // chatId -> messages
};

const now = new Date().toISOString();

const initialState: ChatsState = {
  chats: [
    {
      id: "1",
      title: "Trip ideas to Goa",
      lastMessage: "Cool! Let’s plan a 3-day itinerary.",
      updatedAt: now,
    },
    {
      id: "2",
      title: "Healthy meal prep",
      lastMessage: "Here are 5 high-protein recipes…",
      updatedAt: now,
    },
  ],
  messages: {
    "1": [
      {
        id: "m1",
        chatId: "1",
        role: "user",
        content: "Plan a 3-day trip to Goa",
        createdAt: now,
      },
      {
        id: "m2",
        chatId: "1",
        role: "ai",
        content: "Sure! Beaches, cafes, and forts — here’s a plan…",
        createdAt: now,
      },
    ],
    "2": [
      {
        id: "m3",
        chatId: "2",
        role: "user",
        content: "Give me high-protein meal preps",
        createdAt: now,
      },
      {
        id: "m4",
        chatId: "2",
        role: "ai",
        content: "Absolutely! Consider these 5 options…",
        createdAt: now,
      },
    ],
  },
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    createChat: {
      reducer(state, action: PayloadAction<{ id: string; title: string }>) {
        const { id, title } = action.payload;
        const chat: Chat = {
          id,
          title,
          lastMessage: "Start the conversation…",
          updatedAt: new Date().toISOString(),
        };
        state.chats.unshift(chat);
        state.messages[id] = [];
      },
      prepare(payload: { title?: string } | undefined) {
        const id = nanoid();
        const title = payload?.title || "New chat";
        return { payload: { id, title } };
      },
    },
    deleteChat(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.chats = state.chats.filter((c) => c.id !== id);
      delete state.messages[id];
    },
    addMessage(state, action: PayloadAction<Omit<Message, "id">>) {
      const id = nanoid();
      const msg = { id, ...action.payload } as Message;
      const list = state.messages[msg.chatId] || [];
      const hadNoMessages = list.length === 0;
      list.push(msg);
      state.messages[msg.chatId] = list;
      const chat = state.chats.find((c) => c.id === msg.chatId);
      if (chat) {
        chat.lastMessage = msg.content;
        chat.updatedAt = msg.createdAt;
        // If first message is from user, update the chat title to the first message snippet
        if (hadNoMessages && msg.role === "user") {
          const snippet = msg.content.trim().replace(/\s+/g, " ");
          if (snippet) {
            // Truncate to 60 chars for title
            chat.title =
              snippet.length > 60 ? snippet.slice(0, 60) + "…" : snippet;
          }
        }
      }
    },
  },
});

export const { createChat, deleteChat, addMessage } = chatsSlice.actions;
export default chatsSlice.reducer;
