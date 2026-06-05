import { io, Socket } from "socket.io-client";

const URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_BASE_URL?.replace("/api/v1", "") ||
  "https://taskflow-backend-service-production.up.railway.app";

export const socket: Socket = io(URL, {
  transports: ["websocket"],
  autoConnect: true,
  withCredentials: true,
  auth: (cb) => {
    const token = localStorage.getItem("taskflow_token");
    cb({ token });
  },
});

export const SOCKET_EVENTS = {
  JOIN_PROJECT: "joinProject",
  JOIN_USER: "joinUser",
  TASK_CREATED: "taskCreated",
  TASK_UPDATED: "taskUpdate",
  TASK_ASSIGNED: "taskAssign",
  TASK_DELETED: "taskDelete",
  PROJECT_DELETE: "projectDeleted",
  PROJECT_MEMBER_ADDED: "projectMemberAdd",
  PROJECT_MEMBER_REMOVED: "projectMemberRemove",
  PROJECT_UPDATED: "projectUpdated",
  COMMENT_ADDED: "commentAdded",
  COMMENT_DELETED: "commentDeleted",
  NOTIFICATION: "notification",
  MEMBERSHIP_CHANGED: "membershipChanged",
  MEMBER_ASSIGNEES_CLEARED: "memberAssigneesCleared",
};
