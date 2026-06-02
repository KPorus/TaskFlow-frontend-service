import React from "react";
import { DashboardStats } from "@/types";

interface Props {
  stats: DashboardStats | null;
}

const cards = [
  { key: "totalProjects", label: "Total Projects" },
  { key: "totalTasks", label: "Total Tasks" },
  { key: "completedTasks", label: "Completed Tasks" },
  { key: "pendingTasks", label: "Pending Tasks" },
  { key: "overdueTasks", label: "Overdue Tasks" },
] as const;

export const KpiCards: React.FC<Props> = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {cards.map(({ key, label }) => (
      <div
        key={key}
        className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
      >
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {stats ? stats[key] : "—"}
        </p>
      </div>
    ))}
  </div>
);
