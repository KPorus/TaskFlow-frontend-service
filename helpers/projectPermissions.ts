import { Project, Task, User, UserRole } from "@/types";

/** Map legacy JWT/DB roles to USER */
export const normalizeUserRole = (role?: string): UserRole => {
  if (role === UserRole.ADMIN) return UserRole.ADMIN;
  return UserRole.USER;
};

export const isAdmin = (user?: User | null): boolean =>
  user?.role === UserRole.ADMIN;

export const isProjectOwner = (
  project: Pick<Project, "ownerId">,
  userId: string,
): boolean => project.ownerId === userId;

export const canManageProject = (
  project: Pick<Project, "ownerId"> | null | undefined,
  user?: User | null,
): boolean => {
  if (!user || !project) return false;
  return isAdmin(user) || isProjectOwner(project, user.id);
};

export const canCreateProject = (user?: User | null): boolean =>
  !!user && user.role !== undefined;

export const hasProjectAccess = (
  projectId: string,
  projects: Project[],
): boolean => projects.some((p) => p.id === projectId);

export const canUpdateTask = (
  task: Pick<Task, "assigneeId">,
  project: Pick<Project, "ownerId"> | null | undefined,
  user?: User | null,
): boolean => {
  if (!user || !project) return false;
  if (isAdmin(user) || isProjectOwner(project, user.id)) return true;
  return !!task.assigneeId && task.assigneeId === user.id;
};
