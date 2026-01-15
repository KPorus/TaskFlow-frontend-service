import { io, Socket } from "socket.io-client";

// const URL = "https://task-monitor-swart.vercel.app/api/v1";
const URL = "https://task-monitor-backend-service.onrender.com";

export const socket:Socket = io(URL, {
  transports: ["websocket"],
  autoConnect: true,
  withCredentials: true,
  auth: (cb) => {
    const token = localStorage.getItem("taskflow_token");
    cb({ token });
  },
});

export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_TEAM: "joinTeam",

  // Server -> Client
  TASK_CREATED: "taskCreated",
  TASK_UPDATED: "taskUpdate",
  TASK_ASSIGNED: "taskAssign",
  TASK_DELETED: "taskDelete",

  TEAM_MEMBER_ADDED: "teamMemberAdd",
  TEAM_MEMBER_REMOVED: "teamMemberRemove",
};
