import { PayloadAction } from "@reduxjs/toolkit";
import { DataState, Project } from "../../../types";

export const setActiveProject = (
  state: DataState,
  action: PayloadAction<string>
) => {
  state.activeProjectId = action.payload;
  state.tasks = [];
};

export const applyProjectUpdated = (
  state: DataState,
  action: PayloadAction<Project>
) => {
  const index = state.projects.findIndex((p) => p.id === action.payload.id);
  if (index !== -1) {
    state.projects[index] = action.payload;
  } else {
    state.projects.push(action.payload);
  }
};

export const applyDeleteProject = (
  state: DataState,
  action: PayloadAction<string>
) => {
  state.projects = state.projects.filter((p) => p.id !== action.payload);
  if (state.activeProjectId === action.payload) {
    state.activeProjectId =
      state.projects.length > 0 ? state.projects[0].id : null;
  }
};

export const applyRevokeProjectAccess = (
  state: DataState,
  action: PayloadAction<string>
) => {
  const projectId = action.payload;
  state.projects = state.projects.filter((p) => p.id !== projectId);
  state.tasks = state.tasks.filter((t) => t.projectId !== projectId);
  if (state.activeProjectId === projectId) {
    state.activeProjectId =
      state.projects.length > 0 ? state.projects[0].id : null;
  }
};
