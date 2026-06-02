import React from "react";
import { Task } from "@/types";

interface Props {
  tasks: Task[];
}

export const UpcomingDeadlines: React.FC<Props> = ({ tasks }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <h3 className="font-semibold text-gray-800 mb-3">Upcoming Deadlines</h3>
    <ul className="space-y-2">
      {tasks.length === 0 ? (
        <li className="text-sm text-gray-400">No upcoming deadlines</li>
      ) : (
        tasks.map((t) => (
          <li key={t.id} className="text-sm flex justify-between">
            <span className="text-gray-700 truncate">{t.title}</span>
            <span className="text-gray-400 text-xs shrink-0 ml-2">
              {t.dueDate
                ? new Date(t.dueDate).toLocaleDateString()
                : "—"}
            </span>
          </li>
        ))
      )}
    </ul>
  </div>
);
