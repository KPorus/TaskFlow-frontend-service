import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import { fetchDashboard } from "@/store/slices/dashboardSlice";
import { fetchProjects } from "@/store/slices/helper/dataThunks";
import { KpiCards } from "./KpiCards";
import { ProjectSummaryList } from "./ProjectSummaryList";
import { ActivityFeed } from "./ActivityFeed";
import { WorkloadSummary } from "./WorkloadSummary";
import { UpcomingDeadlines } from "./UpcomingDeadlines";
import { HighPriorityTasks } from "./HighPriorityTasks";
import { TaskCharts } from "./TaskCharts";
import { Layout } from "lucide-react";

export const DashboardHome: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { projects } = useSelector((state: RootState) => state.data);
  const dashboard = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchProjects());
  }, [dispatch]);

  if (projects.length === 1 && !dashboard.loading) {
    // optional: auto-navigate only when user has exactly one project and came fresh
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
          <Layout size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Project progress and team productivity
          </p>
        </div>
      </div>

      {dashboard.loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <>
          <KpiCards stats={dashboard.stats} />
          <TaskCharts charts={dashboard.charts} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProjectSummaryList summaries={dashboard.summaries} />
            <ActivityFeed activities={dashboard.activities} />
            <WorkloadSummary workload={dashboard.workload} />
            <UpcomingDeadlines tasks={dashboard.upcomingDeadlines} />
            <HighPriorityTasks tasks={dashboard.highPriorityTasks} />
          </div>
          {projects.length > 0 && (
            <div className="text-center">
              <button
                onClick={() =>
                  navigate(`/dashboard/projects/${projects[0].id}`)
                }
                className="text-indigo-600 font-medium hover:underline"
              >
                Open project board →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
