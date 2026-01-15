// hooks/useTeamSocket.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskDeleted,
  socketTeamUpdated,
} from "../store/slices/dataSlice";
import { socket, SOCKET_EVENTS } from "../services/socket";
import type { AppDispatch } from "../store/store";
import { mapTask, mapTeam } from "@/helpers/maper";

export const useTeamSocket = (activeTeamId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!activeTeamId) return;

    socket.emit(SOCKET_EVENTS.JOIN_TEAM, activeTeamId);

    const handleTaskCreated = (rawTask: any) => {
      if (rawTask) dispatch(socketTaskCreated(mapTask(rawTask)));
    };

    const handleTaskUpdated = (rawTask: any) => {
      if (rawTask) dispatch(socketTaskUpdated(mapTask(rawTask)));
    };

    const handleTaskDeleted = (rawTaskOrId: any) => {
      const id = rawTaskOrId._id || rawTaskOrId.id || rawTaskOrId;
      if (id) dispatch(socketTaskDeleted(id));
    };

    const handleTeamUpdated = (rawTeam: any) => {
      if (rawTeam) dispatch(socketTeamUpdated(mapTeam(rawTeam)));
    };

    socket.on(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
    socket.on(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
    socket.on(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskUpdated);
    socket.on(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
    socket.on(SOCKET_EVENTS.TEAM_MEMBER_ADDED, handleTeamUpdated);
    socket.on(SOCKET_EVENTS.TEAM_MEMBER_REMOVED, handleTeamUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
      socket.off(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
      socket.off(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskUpdated);
      socket.off(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
      socket.off(SOCKET_EVENTS.TEAM_MEMBER_ADDED, handleTeamUpdated);
      socket.off(SOCKET_EVENTS.TEAM_MEMBER_REMOVED, handleTeamUpdated);
    };
  }, [activeTeamId, dispatch]);
};
