import { ApiService } from "@/services/apiService";
import {
  clearStoredSession,
  refreshAccessToken,
} from "@/helpers/authSession";
import { normalizeUserRole } from "@/helpers/projectPermissions";
import { User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { KEYS } from "@/helpers/request";
import { resetAppData } from "../dataSlice";
import { resetDashboard } from "../dashboardSlice";

const clearAppState = (dispatch: (action: unknown) => void) => {
  dispatch(resetAppData());
  dispatch(resetDashboard());
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password?: string },
    { dispatch },
  ) => {
    clearAppState(dispatch);
    return await ApiService.auth.login(email, password);
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password?: string;
    },
    { dispatch },
  ) => {
    clearAppState(dispatch);
    return await ApiService.auth.register(name, email, password);
  },
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { dispatch }) => {
    const userData = localStorage.getItem(KEYS.USER_DATA);
    if (!userData) {
      throw new Error("No session found");
    }

    let token = localStorage.getItem(KEYS.TOKEN);
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = refreshed;
    }

    if (!token) {
      clearStoredSession();
      clearAppState(dispatch);
      throw new Error("No session found");
    }

    const user = JSON.parse(userData) as User;
    return {
      user: { ...user, role: normalizeUserRole(user.role) },
      token,
    };
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    clearStoredSession();
    clearAppState(dispatch);
  },
);
