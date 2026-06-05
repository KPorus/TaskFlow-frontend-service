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
  applyClearMemberTaskAssignees,
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
    clearDataError: (state) => {
      state.error = null;
    },
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
        applyClearMemberTaskAssignees(state, {
          type: "data/clearMemberTaskAssignees",
          payload: {
            projectId: action.meta.arg.projectId,
            memberId: action.meta.arg.userId,
          },
        });
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
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load tasks";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        applySocketTaskCreated(state, action);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to create task";
      })
      .addCase(updateTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        applyTaskUpdated(state, action);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to update task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        applyTaskDeleted(state, action);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to delete task";
      });
  },
});

export const {
  setActiveProject: setActiveProjectAction,
  resetAppData,
  clearDataError,
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskDeleted,
  socketProjectUpdated,
  socketProjectDelete,
  revokeProjectAccess,
  clearMemberTaskAssignees,
} = dataSlice.actions;

export default dataSlice.reducer;
