import { createSlice } from "@reduxjs/toolkit";
import { DataState } from "../../types";
import {
  applyProjectUpdated,
  setActiveProject,
  applyDeleteProject,
} from "./helper/projectReducers";
import { socketReducers } from "./helper/socketReducers";
import {
  addProjectMember,
  createTask,
  createProject,
  deleteTask,
  deleteProject,
  fetchAllUsers,
  fetchTasks,
  fetchProjects,
  removeProjectMember,
  updateTask,
  updateProject,
} from "./helper/dataThunks";
import {
  applySocketTaskCreated,
  applyTaskDeleted,
  applyTaskUpdated,
} from "./helper/taskReducers";

const initialState: DataState = {
  projects: [],
  tasks: [],
  users: [],
  activeProjectId: null,
  taskTotal: 0,
  taskPage: 1,
  taskTotalPages: 1,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setActiveProject,
    resetAppData: () => initialState,
    ...socketReducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        if (!state.activeProjectId && action.payload.length > 0) {
          state.activeProjectId = action.payload[0].id;
        }
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.activeProjectId = action.payload.id;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        applyProjectUpdated(state, action);
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        applyDeleteProject(state, action);
      })
      .addCase(addProjectMember.fulfilled, (state, action) => {
        applyProjectUpdated(state, action);
      })
      .addCase(removeProjectMember.fulfilled, (state, action) => {
        applyProjectUpdated(state, action);
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
        state.taskTotal = action.payload.total;
        state.taskPage = action.payload.page;
        state.taskTotalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        applySocketTaskCreated(state, action);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        applyTaskUpdated(state, action);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        applyTaskDeleted(state, action);
      });
  },
});

export const {
  setActiveProject: setActiveProjectAction,
  resetAppData,
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskDeleted,
  socketProjectUpdated,
  socketProjectDelete,
  revokeProjectAccess,
} = dataSlice.actions;

export default dataSlice.reducer;
