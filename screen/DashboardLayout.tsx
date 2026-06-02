import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { NotificationBell } from "../components/layout/NotificationBell";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { fetchProjects } from "@/store/slices/helper/dataThunks";
import { fetchNotifications } from "@/store/slices/notificationSlice";

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

  useProjectSocket(activeProjectId ?? undefined);

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
        <div className="absolute top-3 right-4 z-10">
          <NotificationBell />
        </div>
        <Outlet context={{ setSidebarOpen }} />
      </main>
    </div>
  );
};
