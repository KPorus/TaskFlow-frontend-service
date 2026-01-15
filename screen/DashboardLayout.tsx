import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { useTeamSocket } from "@/hooks/useTeamSocket";
import { fetchTeams } from "@/store/slices/helper/dataThunks";

export const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeTeamId, teams } = useSelector((state: RootState) => state.data);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchTeams());
    }
  }, [user, dispatch]);
  useTeamSocket(activeTeamId);

  return (
    <div id="dashboard-screen-ts" className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main id="dashboard-home-component--ts" className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <Outlet context={{ setSidebarOpen }} />
      </main>
    </div>
  );
};
