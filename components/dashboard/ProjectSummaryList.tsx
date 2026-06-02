import React from "react";
import { useNavigate } from "react-router-dom";
import { ProjectSummary } from "@/types";

interface Props {
  summaries: ProjectSummary[];
}

export const ProjectSummaryList: React.FC<Props> = ({ summaries }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <h3 className="font-semibold text-gray-800 mb-3">Project Summary</h3>
    <ul className="space-y-2">
      {summaries.length === 0 ? (
        <li className="text-sm text-gray-400">No projects yet</li>
      ) : (
        summaries.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => navigate(`/dashboard/projects/${s.id}`)}
              className="w-full text-left p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{s.name}</span>
                <span className="text-xs text-indigo-600">
                  {s.completionPercent}% done
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {s.pendingTasks} tasks pending
                {s.deadlineLabel ? ` · ${s.deadlineLabel}` : ""}
              </p>
            </button>
          </li>
        ))
      )}
    </ul>
  </div>
);
