import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Notification, NotificationState } from "../../types";
import { ApiService } from "@/services/apiService";
import { mapNotification } from "@/helpers/maper";
import type { AppDispatch } from "../store";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async () => {
    return await ApiService.notifications.list();
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id: string) => {
    await ApiService.notifications.markRead(id);
    return id;
  }
);

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const item = state.items.find((n) => n.id === action.payload);
        if (item && !item.read) {
          item.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const { addNotification } = notificationSlice.actions;

export const pushSocketNotification =
  (raw: unknown) => (dispatch: AppDispatch) => {
    dispatch(addNotification(mapNotification(raw)));
  };

export default notificationSlice.reducer;
