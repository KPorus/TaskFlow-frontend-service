import React from "react";
import { TaskPriority, TaskStatus } from "@/types";

interface Props {
  status: TaskStatus | "";
  priority: TaskPriority | "";
  assignee: string;
  deadlineStatus: "" | "UPCOMING" | "OVERDUE";
  members: { id: string; name: string }[];
  onStatusChange: (v: TaskStatus | "") => void;
  onPriorityChange: (v: TaskPriority | "") => void;
  onAssigneeChange: (v: string) => void;
  onDeadlineStatusChange: (v: "" | "UPCOMING" | "OVERDUE") => void;
}

export const TaskFilters: React.FC<Props> = ({
  status,
  priority,
  assignee,
  deadlineStatus,
  members,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onDeadlineStatusChange,
}) => (
  <div className="flex flex-wrap gap-2">
    <select
      value={status}
      onChange={(e) => onStatusChange(e.target.value as TaskStatus | "")}
      className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
    >
      <option value="">All Status</option>
      {Object.values(TaskStatus).map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
    <select
      value={priority}
      onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "")}
      className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
    >
      <option value="">All Priority</option>
      {Object.values(TaskPriority).map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
    <select
      value={assignee}
      onChange={(e) => onAssigneeChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
    >
      <option value="">All Members</option>
      {members.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </select>
    <select
      value={deadlineStatus}
      onChange={(e) =>
        onDeadlineStatusChange(
          e.target.value as "" | "UPCOMING" | "OVERDUE"
        )
      }
      className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
    >
      <option value="">All Deadlines</option>
      <option value="UPCOMING">Upcoming</option>
      <option value="OVERDUE">Overdue</option>
    </select>
  </div>
);
