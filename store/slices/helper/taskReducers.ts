import { PayloadAction } from "@reduxjs/toolkit";
import { DataState, Task } from "../../../types";

export const TASKS_PAGE_LIMIT = 50;

export const applySocketTaskCreated = (
  state: DataState,
  action: PayloadAction<Task>
) => {
  if (state.activeProjectId === action.payload.projectId) {
    if (!state.tasks.find((t) => t.id === action.payload.id)) {
      state.tasks.push(action.payload);
    }
  }
};

export const applyTaskUpdated = (
  state: DataState,
  action: PayloadAction<Task>
) => {
  const index = state.tasks.findIndex((t) => t.id === action.payload.id);
  if (index !== -1) {
    state.tasks[index] = action.payload;
  }
};

export const applyTaskDeleted = (
  state: DataState,
  action: PayloadAction<string>,
) => {
  const id = String(action.payload);
  const hadTask = state.tasks.some((t) => String(t.id) === id);
  state.tasks = state.tasks.filter((t) => String(t.id) !== id);

  if (hadTask) {
    state.taskTotal = Math.max(0, state.taskTotal - 1);
    state.taskTotalPages = Math.max(
      1,
      Math.ceil(state.taskTotal / TASKS_PAGE_LIMIT),
    );
  }
};

export type ClearMemberTaskAssigneesPayload = {
  projectId: string;
  memberId: string;
};

export const applyClearMemberTaskAssignees = (
  state: DataState,
  action: PayloadAction<ClearMemberTaskAssigneesPayload>
) => {
  const { projectId, memberId } = action.payload;
  state.tasks.forEach((task) => {
    if (task.projectId === projectId && task.assigneeId === memberId) {
      task.assigneeId = undefined;
    }
  });
};
