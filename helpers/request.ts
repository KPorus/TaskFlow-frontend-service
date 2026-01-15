const BASE_URL="https://task-monitor-backend-service.onrender.com/api/v1"
export const KEYS = {
  USERS: "taskflow_users",
  TASKS: "taskflow_tasks",
  TOKEN: "taskflow_token",
  USER_DATA: "taskflow_user",
};

/**
 * Core Request Wrapper
 * Handles Authorization headers, JSON content types, and automatic token refresh.
 */
export async function request(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<any> {
  const token = localStorage.getItem(KEYS.TOKEN);
  const headers = new Headers(options.headers);

  // Explicitly set Authorization header as required
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };
//   console.log(process.env.BASE_URL);
  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Handle Token Refresh (401 Unauthorized)
  if (
    response.status === 401 &&
    !isRetry &&
    !endpoint.includes("/auth/login")
  ) {
    try {
      const refreshResponse = await fetch(
        `${BASE_URL}/auth/refreshToken`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        const refreshResult = await refreshResponse.json();
        const authHeader = refreshResponse.headers.get("Authorization");
        const newToken = authHeader
          ? authHeader.replace("Bearer ", "")
          : refreshResult.data;

        if (newToken) {
          localStorage.setItem(KEYS.TOKEN, newToken);
          return request(endpoint, options, true);
        }
      }
    } catch (refreshErr) {
      console.error("Session refresh failed:", refreshErr);
    }

    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.USER_DATA);
    throw new Error("Session expired");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  const authHeader = response.headers.get("Authorization");
  if (
    authHeader &&
    (endpoint.includes("/auth/login") || endpoint.includes("/auth/register"))
  ) {
    const receivedToken = authHeader.replace("Bearer ", "");
    localStorage.setItem(KEYS.TOKEN, receivedToken);
  }

  return response.json();
}
