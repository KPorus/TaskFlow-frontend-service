import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Notification, NotificationState } from "../../types";
import { ApiService } from "@/services/apiService";
import { mapNotification } from "@/helpers/maper";
import { fetchProjects } from "./helper/dataThunks";
import { fetchDashboard } from "./dashboardSlice";
import { revokeProjectAccess } from "./dataSlice";
import type { AppDispatch } from "../store";

const projectIdFromLink = (link?: string): string | null => {
  if (!link) return null;
  const match = link.match(/\/projects\/([^/]+)/);
  return match?.[1] ?? null;
};

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
    const notification = mapNotification(raw);
    dispatch(addNotification(notification));
    if (
      notification.type === "MEMBER_ADDED" ||
      notification.type === "MEMBER_REMOVED"
    ) {
      if (notification.type === "MEMBER_REMOVED") {
        const projectId = projectIdFromLink(notification.link);
        if (projectId) dispatch(revokeProjectAccess(projectId));
      }
      dispatch(fetchProjects());
      dispatch(fetchDashboard());
    }
  };

export default notificationSlice.reducer;
