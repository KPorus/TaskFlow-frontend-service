import React from "react";
import { Activity } from "@/types";

interface Props {
  activities: Activity[];
}

export const ActivityFeed: React.FC<Props> = ({ activities }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
    <ul className="space-y-3 max-h-64 overflow-y-auto">
      {activities.length === 0 ? (
        <li className="text-sm text-gray-400">No recent activity</li>
      ) : (
        activities.map((a) => (
          <li key={a.id} className="text-sm border-l-2 border-indigo-200 pl-3">
            <p className="text-gray-700">{a.message}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(a.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {a.actorName ? ` · ${a.actorName}` : ""}
            </p>
          </li>
        ))
      )}
    </ul>
  </div>
);
