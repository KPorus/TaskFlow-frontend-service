import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskDeleted,
  socketProjectUpdated,
  socketProjectDelete,
} from "../store/slices/dataSlice";
import { socket, SOCKET_EVENTS } from "../services/socket";
import type { AppDispatch } from "../store/store";
import { mapTask, mapProject } from "@/helpers/maper";

export const useProjectSocket = (activeProjectId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!activeProjectId) return;

    socket.emit(SOCKET_EVENTS.JOIN_PROJECT, activeProjectId);

    const handleTaskCreated = (rawTask: unknown) => {
      if (rawTask) dispatch(socketTaskCreated(mapTask(rawTask)));
    };

    const handleTaskUpdated = (rawTask: unknown) => {
      if (rawTask) dispatch(socketTaskUpdated(mapTask(rawTask)));
    };

    const handleTaskDeleted = (raw: { _id?: string; id?: string }) => {
      const id = raw?._id || raw?.id || (raw as string);
      if (id) dispatch(socketTaskDeleted(String(id)));
    };

    const handleProjectUpdated = (raw: unknown) => {
      if (raw) dispatch(socketProjectUpdated(mapProject(raw)));
    };

    const handleProjectDelete = (data: { projectId?: string }) => {
      if (data?.projectId) dispatch(socketProjectDelete(data.projectId));
    };

    const handleNotification = (raw: unknown) => {
      dispatch(pushSocketNotification(raw));
    };

    socket.on(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
    socket.on(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
    socket.on(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskUpdated);
    socket.on(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
    socket.on(SOCKET_EVENTS.PROJECT_DELETE, handleProjectDelete);
    socket.on(SOCKET_EVENTS.PROJECT_MEMBER_ADDED, handleProjectUpdated);
    socket.on(SOCKET_EVENTS.PROJECT_MEMBER_REMOVED, handleProjectUpdated);
    socket.on(SOCKET_EVENTS.PROJECT_UPDATED, handleProjectUpdated);
    return () => {
      socket.off(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
      socket.off(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
      socket.off(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskUpdated);
      socket.off(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
      socket.off(SOCKET_EVENTS.PROJECT_DELETE, handleProjectDelete);
      socket.off(SOCKET_EVENTS.PROJECT_MEMBER_ADDED, handleProjectUpdated);
      socket.off(SOCKET_EVENTS.PROJECT_MEMBER_REMOVED, handleProjectUpdated);
      socket.off(SOCKET_EVENTS.PROJECT_UPDATED, handleProjectUpdated);
    };
  }, [activeProjectId, dispatch]);
};
