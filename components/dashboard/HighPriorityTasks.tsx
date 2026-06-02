import React from "react";
import { Task } from "@/types";

interface Props {
  tasks: Task[];
}

export const HighPriorityTasks: React.FC<Props> = ({ tasks }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <h3 className="font-semibold text-gray-800 mb-3">High Priority Tasks</h3>
    <ul className="space-y-2">
      {tasks.length === 0 ? (
        <li className="text-sm text-gray-400">No high priority tasks</li>
      ) : (
        tasks.map((t) => (
          <li
            key={t.id}
            className="text-sm p-2 bg-red-50 rounded border border-red-100"
          >
            <span className="font-medium text-gray-800">{t.title}</span>
            <span className="text-xs text-red-600 ml-2">HIGH</span>
          </li>
        ))
      )}
    </ul>
  </div>
);
