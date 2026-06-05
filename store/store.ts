import { configureStore, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dataReducer from "./slices/dataSlice";
import dashboardReducer from "./slices/dashboardSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    dashboard: dashboardReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
