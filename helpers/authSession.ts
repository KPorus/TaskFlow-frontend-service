import { normalizeUserRole } from "@/helpers/projectPermissions";
import { User } from "@/types";
import { KEYS } from "@/helpers/request";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1";

export const clearStoredSession = () => {
  localStorage.removeItem(KEYS.TOKEN);
  localStorage.removeItem(KEYS.USER_DATA);
};

export const parseAuthResponse = (
  result: { data?: Record<string, unknown> },
  fallbackName?: string,
): { user: User; token: string } => {
  const token = localStorage.getItem(KEYS.TOKEN);
  if (!token) {
    throw new Error("No access token received");
  }

  const userData = (result.data?.user ?? result.data) as Record<string, unknown>;
  const user: User = {
    id: String(userData.id || userData._id),
    email: String(userData.email),
    name: String(
      userData.name || fallbackName || String(userData.email).split("@")[0],
    ),
    role: normalizeUserRole(userData.role as string | undefined),
  };

  localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
  return { user, token };
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshResponse = await fetch(`${BASE_URL}/auth/refreshToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!refreshResponse.ok) return null;

    const refreshResult = await refreshResponse.json();
    const authHeader = refreshResponse.headers.get("Authorization");
    const newToken = authHeader
      ? authHeader.replace("Bearer ", "")
      : refreshResult.data?.accessToken || refreshResult.data;

    if (newToken && typeof newToken === "string") {
      localStorage.setItem(KEYS.TOKEN, newToken);
      return newToken;
    }
  } catch {
    return null;
  }
  return null;
};
