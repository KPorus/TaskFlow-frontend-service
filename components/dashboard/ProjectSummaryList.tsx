import React from "react";
import { useNavigate } from "react-router-dom";
import { ProjectSummary } from "@/types";

interface Props {
  summaries: ProjectSummary[];
}

const roleBadge = (role?: ProjectSummary["roleOnProject"]) => {
  if (role === "ADMIN")
    return { label: "Admin view", className: "bg-amber-100 text-amber-800" };
  if (role === "OWNER")
    return { label: "Your project", className: "bg-indigo-100 text-indigo-800" };
  if (role === "MEMBER")
    return { label: "Member", className: "bg-slate-100 text-slate-600" };
  return null;
};

export const ProjectSummaryList: React.FC<Props> = ({ summaries }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">Project Summary</h3>
      <ul className="space-y-2">
        {summaries.length === 0 ? (
          <li className="text-sm text-gray-400">No projects yet</li>
        ) : (
          summaries.map((s) => {
            const badge = roleBadge(s.roleOnProject);
            return (
              <li key={s.id}>
                <button
                  onClick={() => navigate(`/dashboard/projects/${s.id}`)}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100"
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium text-gray-800">{s.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {badge && (
                        <span
                          className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      )}
                      <span className="text-xs text-indigo-600">
                        {s.completionPercent}% done
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.pendingTasks} tasks pending
                    {s.deadlineLabel ? ` · ${s.deadlineLabel}` : ""}
                  </p>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};
