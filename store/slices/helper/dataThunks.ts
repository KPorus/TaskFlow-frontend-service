import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../../services/apiService";
import { Task, TaskListFilters } from "../../../types";

export const fetchProjects = createAsyncThunk(
  "data/fetchProjects",
  async () => {
    return await ApiService.projects.list();
  }
);

export const createProject = createAsyncThunk(
  "data/createProject",
  async (data: {
    name: string;
    description?: string;
    deadline?: string;
  }) => {
    return await ApiService.projects.create(data);
  }
);

export const updateProject = createAsyncThunk(
  "data/updateProject",
  async ({
    projectId,
    updates,
  }: {
    projectId: string;
    updates: Parameters<typeof ApiService.projects.update>[1];
  }) => {
    return await ApiService.projects.update(projectId, updates);
  }
);

export const deleteProject = createAsyncThunk(
  "data/deleteProject",
  async (projectId: string) => {
    return await ApiService.projects.delete(projectId);
  }
);

export const addProjectMember = createAsyncThunk(
  "data/addMember",
  async ({ projectId, userId }: { projectId: string; userId: string }) => {
    return await ApiService.projects.addMember(projectId, userId);
  }
);

export const removeProjectMember = createAsyncThunk(
  "data/removeMember",
  async ({ projectId, userId }: { projectId: string; userId: string }) => {
    return await ApiService.projects.removeMember(projectId, userId);
  }
);

export const fetchTasks = createAsyncThunk(
  "data/fetchTasks",
  async ({
    projectId,
    filters,
  }: {
    projectId: string;
    filters?: TaskListFilters;
  }) => {
    return await ApiService.tasks.list(projectId, filters);
  }
);

export const fetchAllUsers = createAsyncThunk(
  "data/fetchAllUsers",
  async () => {
    return await ApiService.users.list();
  }
);

export const createTask = createAsyncThunk(
  "data/createTask",
  async (task: Omit<Task, "id" | "createdAt">) => {
    return await ApiService.tasks.create(task);
  }
);

export const updateTask = createAsyncThunk(
  "data/updateTask",
  async ({
    taskId,
    updates,
  }: {
    taskId: string;
    updates: Partial<Task>;
  }) => {
    return await ApiService.tasks.update(taskId, updates);
  }
);

export const deleteTask = createAsyncThunk(
  "data/deleteTask",
  async ({
    taskId,
    projectId,
  }: {
    taskId: string;
    projectId: string;
  }) => {
    await ApiService.tasks.delete(taskId, projectId);
    return taskId;
  }
);
