import React from "react";
import { WorkloadItem } from "@/types";

interface Props {
  workload: WorkloadItem[];
}

export const WorkloadSummary: React.FC<Props> = ({ workload }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <h3 className="font-semibold text-gray-800 mb-3">Member Workload</h3>
    <div className="space-y-2">
      {workload.length === 0 ? (
        <p className="text-sm text-gray-400">No assigned tasks</p>
      ) : (
        workload.map((w) => (
          <div
            key={w.userId}
            className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
          >
            <span className="font-medium text-gray-700">{w.name}</span>
            <span className="text-gray-500">
              {w.completed}/{w.total} done · {w.pending} pending
            </span>
          </div>
        ))
      )}
    </div>
  </div>
);
