import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Analitics } from "../../types/LLM";

interface ChatMessage {
  id: number;
  type: string;
  message: string | object;
  time: string;
}

export interface ChatState {
  value: ChatMessage[];
}

const initialChatState: ChatState = {
  value: [],
};

const savedChatData = localStorage.getItem("chatData");
if (savedChatData) {
  initialChatState.value = JSON.parse(savedChatData);
}

const chatSlice = createSlice({
  name: "chat",
  initialState: initialChatState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.value.push(action.payload);
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        chatId: number;
        result: { result: any; query: string };
      }>
    ) => {
      const { chatId, result } = action.payload;
      state.value = state.value.map((item) => {
        if (item.id === chatId) {
          return {
            ...item,
            message: {
              ...(typeof item.message === "object" && item.message !== null
                ? item.message
                : {}),
              result: result.result,
              query: result.query,
              analitics: null,
            },
          };
        }
        return item;
      });
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },
    addAnalitics: (
      state,
      action: PayloadAction<{
        chatId: number;
        analitics: Analitics[];
      }>
    ) => {
      const { chatId, analitics } = action.payload;
      state.value = state.value.map((item) => {
        if (item.id === chatId) {
          return {
            ...item,
            message: {
              ...(typeof item.message === "object" && item.message !== null
                ? item.message
                : {}),
              analitics: analitics,
            },
          };
        }
        return item;
      });
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },
    updateResult: (
      state,
      action: PayloadAction<{
        chatId: number;
        result: any;
      }>
    ) => {
      const { chatId, result } = action.payload;
      state.value = state.value.map((item) => {
        if (item.id === chatId) {
          return {
            ...item,
            message: {
              ...(typeof item.message === "object" && item.message !== null
                ? item.message
                : {}),
              result: result,
              analitics: null,
            },
          };
        }
        return item;
      });
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },
  },
});

export const { addMessage, updateMessage, addAnalitics, updateResult } =
  chatSlice.actions;
export default chatSlice.reducer;
