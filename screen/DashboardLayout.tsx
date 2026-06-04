import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { NotificationBell } from "../components/layout/NotificationBell";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { useMembershipSync } from "@/hooks/useMembershipSync";
import { fetchProjects } from "@/store/slices/helper/dataThunks";
import { fetchNotifications } from "@/store/slices/notificationSlice";
import { socket, SOCKET_EVENTS } from "@/services/socket";

export type DashboardLayoutContext = {
  setSidebarOpen: (isOpen: boolean) => void;
};

export const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeProjectId } = useSelector((state: RootState) => state.data);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchProjects());
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user?.id) {
      socket.emit(SOCKET_EVENTS.JOIN_USER, user.id);
    }
  }, [user?.id]);

  useMembershipSync();
  useProjectSocket(activeProjectId ?? undefined);

  const outletContext: DashboardLayoutContext = {
    setSidebarOpen,
  };

  return (
    <div
      id="dashboard-screen-ts"
      className="flex h-screen overflow-hidden bg-gray-50"
    >
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main
        id="dashboard-home-component--ts"
        className="flex-1 flex flex-col h-full overflow-hidden w-full relative"
      >
        <header className="lg:hidden flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800">TaskFlow</span>
          <div className="w-10" />
        </header>

        <div className="absolute top-3 right-4 z-10 lg:top-3">
          <NotificationBell />
        </div>
        <Outlet context={outletContext} />
      </main>
    </div>
  );
};
