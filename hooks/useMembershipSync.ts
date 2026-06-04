import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  revokeProjectAccess,
  socketProjectUpdated,
} from "@/store/slices/dataSlice";
import { fetchProjects } from "@/store/slices/helper/dataThunks";
import { fetchDashboard } from "@/store/slices/dashboardSlice";
import { mapNotification, mapProject } from "@/helpers/maper";
import { socket, SOCKET_EVENTS } from "@/services/socket";
import type { AppDispatch } from "@/store/store";

type MembershipPayload = {
  action: "ADDED" | "REMOVED";
  projectId: string;
  project?: unknown;
};

const projectIdFromLink = (link?: string): string | null => {
  if (!link) return null;
  const match = link.match(/\/projects\/([^/]+)/);
  return match?.[1] ?? null;
};

const isOnProjectRoute = (pathname: string, projectId: string) =>
  pathname.includes(`/projects/${projectId}`);

export const useMembershipSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId: routeProjectId } = useParams<{ projectId?: string }>();

  useEffect(() => {
    const refreshLists = () => {
      dispatch(fetchProjects());
      dispatch(fetchDashboard());
    };

    const redirectIfOnRevokedProject = (projectId: string) => {
      if (
        routeProjectId === projectId ||
        isOnProjectRoute(location.pathname, projectId)
      ) {
        navigate("/dashboard");
      }
    };

    const handleMembershipChanged = (payload: MembershipPayload) => {
      const { action, projectId, project } = payload;
      if (action === "ADDED" && project) {
        dispatch(socketProjectUpdated(mapProject(project)));
      } else if (action === "REMOVED") {
        dispatch(revokeProjectAccess(projectId));
        redirectIfOnRevokedProject(projectId);
      }
      refreshLists();
    };

    const handleNotificationNavigate = (raw: unknown) => {
      const notification = mapNotification(raw);
      if (notification.type !== "MEMBER_REMOVED") return;
      const projectId = projectIdFromLink(notification.link);
      if (projectId) redirectIfOnRevokedProject(projectId);
    };

    socket.on(SOCKET_EVENTS.MEMBERSHIP_CHANGED, handleMembershipChanged);
    socket.on(SOCKET_EVENTS.NOTIFICATION, handleNotificationNavigate);

    return () => {
      socket.off(SOCKET_EVENTS.MEMBERSHIP_CHANGED, handleMembershipChanged);
      socket.off(SOCKET_EVENTS.NOTIFICATION, handleNotificationNavigate);
    };
  }, [dispatch, navigate, routeProjectId, location.pathname]);
};
