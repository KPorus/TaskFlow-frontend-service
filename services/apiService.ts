import {
  mapActivity,
  mapComment,
  mapNotification,
  mapProject,
  mapTask,
  mapUser,
} from "@/helpers/maper";
import { Task, TaskListFilters } from "../types";
import { KEYS, request } from "@/helpers/request";

export const ApiService = {
  auth: {
    login: async (email: string, password?: string) => {
      const result = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token =
        localStorage.getItem(KEYS.TOKEN) || result.data?.accessToken;
      if (token) localStorage.setItem(KEYS.TOKEN, token);

      const userData = result.data?.user || result.data;
      const user = {
        id: userData.id || userData._id,
        email: userData.email,
        name: userData.name || userData.email.split("@")[0],
        role: userData.role,
      };

      localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
      return { user, token };
    },
    register: async (name: string, email: string, password?: string) => {
      const result = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const token =
        localStorage.getItem(KEYS.TOKEN) || result.data?.accessToken;
      if (token) localStorage.setItem(KEYS.TOKEN, token);

      const userData = result.data?.user || result.data;
      const user = {
        id: userData.id || userData._id,
        email: userData.email,
        name: name,
        role: userData.role,
      };

      localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
      return { user, token };
    },
  },
  projects: {
    list: async (params?: { status?: string; search?: string }) => {
      const qs = new URLSearchParams();
      if (params?.status) qs.set("status", params.status);
      if (params?.search) qs.set("search", params.search);
      const query = qs.toString() ? `?${qs.toString()}` : "";
      const result = await request(`/project/list${query}`);
      const projects = Array.isArray(result.data?.projects)
        ? result.data.projects
        : Array.isArray(result.data)
          ? result.data
          : [];
      return projects.map(mapProject);
    },
    create: async (data: {
      name: string;
      description?: string;
      deadline?: string;
      status?: string;
    }) => {
      const result = await request("/project/create", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return mapProject(result.data?.project || result.data);
    },
    update: async (
      projectId: string,
      data: Partial<{
        name: string;
        description: string;
        deadline: string;
        status: string;
      }>
    ) => {
      const result = await request(`/project/update/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return mapProject(result.data?.project || result.data);
    },
    addMember: async (projectId: string, userId: string) => {
      const result = await request(`/project/${projectId}/add-member`, {
        method: "PUT",
        body: JSON.stringify({ user: userId }),
      });
      return mapProject(result.data?.project || result.data);
    },
    removeMember: async (projectId: string, userId: string) => {
      const result = await request(`/project/remove-member`, {
        method: "PUT",
        body: JSON.stringify({ projectId, memberId: userId }),
      });
      return mapProject(result.data?.project || result.data);
    },
    delete: async (projectId: string) => {
      await request(`/project/delete-project`, {
        method: "DELETE",
        body: JSON.stringify({ projectId }),
      });
      return projectId;
    },
  },
  tasks: {
    list: async (projectId: string, filters?: TaskListFilters) => {
      const result = await request(`/task/task-list`, {
        method: "POST",
        body: JSON.stringify({ projectId, ...filters }),
      });
      const data = result.data || result;
      const tasks = (data.tasks || []).map(mapTask);
      return {
        tasks,
        total: data.total ?? tasks.length,
        page: data.page ?? 1,
        totalPages: data.totalPages ?? 1,
      };
    },
    create: async (task: Omit<Task, "id" | "createdAt">) => {
      const payload = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        assignee: task.assigneeId,
      };

      const result = await request(`/task/create-task/${task.projectId}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return mapTask(result.data?.task || result.data);
    },
    update: async (taskId: string, updates: Partial<Task>) => {
      const payload: Record<string, unknown> = { ...updates };
      if (updates.assigneeId) {
        payload.assignee = updates.assigneeId;
        delete payload.assigneeId;
      }
      delete payload.projectId;
      delete payload.creatorId;
      delete payload.id;

      const result = await request(`/task/update-task/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      return mapTask(result.data?.task || result.data);
    },
    delete: async (taskId: string, projectId: string) => {
      await request(`/task/delete-task`, {
        method: "DELETE",
        body: JSON.stringify({ id: taskId, projectId }),
      });
      return true;
    },
  },
  users: {
    list: async () => {
      const result = await request("/auth/get-all-users");
      const users = Array.isArray(result.data?.users)
        ? result.data.users
        : Array.isArray(result.data)
          ? result.data
          : [];
      return users.map(mapUser);
    },
  },
  dashboard: {
    stats: async () => {
      const result = await request("/dashboard/stats");
      return result.data?.stats || result.data;
    },
    projectSummaries: async () => {
      const result = await request("/dashboard/project-summaries");
      return result.data?.summaries || [];
    },
    workload: async () => {
      const result = await request("/dashboard/workload");
      return result.data?.workload || [];
    },
    upcomingDeadlines: async (days = 7) => {
      const result = await request(
        `/dashboard/upcoming-deadlines?days=${days}`
      );
      return (result.data?.tasks || []).map(mapTask);
    },
    highPriority: async () => {
      const result = await request("/dashboard/high-priority");
      return (result.data?.tasks || []).map(mapTask);
    },
    charts: async () => {
      const result = await request("/dashboard/charts");
      return result.data?.charts || result.data;
    },
  },
  activity: {
    recent: async (limit = 10) => {
      const result = await request(`/activity/recent?limit=${limit}`);
      return (result.data?.activities || []).map(mapActivity);
    },
  },
  comments: {
    list: async (taskId: string) => {
      const result = await request(`/comment/${taskId}`);
      return (result.data?.comments || []).map(mapComment);
    },
    create: async (taskId: string, text: string) => {
      const result = await request(`/comment/${taskId}`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      return mapComment(result.data?.comment || result.data);
    },
    delete: async (commentId: string) => {
      await request(`/comment/${commentId}`, { method: "DELETE" });
    },
  },
  notifications: {
    list: async () => {
      const result = await request("/notification");
      return (result.data?.notifications || []).map(mapNotification);
    },
    markRead: async (id: string) => {
      await request(`/notification/${id}/read`, { method: "PUT" });
    },
  },
};
