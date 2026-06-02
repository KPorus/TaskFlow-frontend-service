import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartsData {
  tasksByPriority: { priority: string; count: number }[];
  taskStatusDistribution: { status: string; count: number }[];
  projectProgress: {
    name: string;
    total: number;
    completed: number;
    percent: number;
  }[];
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

interface Props {
  charts: ChartsData | null;
}

export const TaskCharts: React.FC<Props> = ({ charts }) => {
  if (!charts) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
        Loading charts...
      </div>
    );
  }

  const priorityData = charts.tasksByPriority.map((d) => ({
    name: d.priority,
    value: d.count,
  }));

  const statusData = charts.taskStatusDistribution.map((d) => ({
    name: d.status.replace("_", " "),
    count: d.count,
  }));

  const progressData = charts.projectProgress.map((p) => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
    percent: p.percent,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm">
          Tasks by Priority
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={priorityData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {priorityData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm">
          Task Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm">
          Project Progress
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={progressData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="percent" fill="#10b981" name="% Complete" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
