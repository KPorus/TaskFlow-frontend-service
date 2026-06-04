import { PayloadAction } from "@reduxjs/toolkit";
import { DataState, Task } from "../../../types";

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
  action: PayloadAction<string>
) => {
  state.tasks = state.tasks.filter((t) => t.id !== action.payload);
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
