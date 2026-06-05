export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type ProjectRoleOnProject = "OWNER" | "MEMBER" | "ADMIN";

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  avatar?: string;
}

export interface ProjectMember {
  user: User | string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  status: ProjectStatus;
  ownerId: string;
  members: ProjectMember[];
  roleOnProject?: ProjectRoleOnProject;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string | null;
  projectId: string;
  creatorId: string;
  dueDate?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName?: string;
  text: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  actorName?: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  isSystemWide?: boolean;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  pendingTasks: number;
  completionPercent: number;
  deadlineLabel: string;
  roleOnProject?: ProjectRoleOnProject;
  isOwner?: boolean;
}

export interface WorkloadItem {
  userId: string;
  name: string;
  email: string;
  total: number;
  completed: number;
  pending: number;
}

export interface TaskListFilters {
  search?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string;
  deadlineStatus?: "UPCOMING" | "OVERDUE";
  sortBy?: "createdAt" | "dueDate" | "priority" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface DataState {
  projects: Project[];
  tasks: Task[];
  users: User[];
  activeProjectId: string | null;
  taskTotal: number;
  taskPage: number;
  taskTotalPages: number;
  loading: boolean;
  error: string | null;
}

export interface DashboardState {
  stats: DashboardStats | null;
  summaries: ProjectSummary[];
  workload: WorkloadItem[];
  upcomingDeadlines: Task[];
  highPriorityTasks: Task[];
  activities: Activity[];
  charts: {
    tasksByPriority: { priority: string; count: number }[];
    taskStatusDistribution: { status: string; count: number }[];
    projectProgress: { name: string; total: number; completed: number; percent: number }[];
  } | null;
  loading: boolean;
}

export interface NotificationState {
  items: Notification[];
  unreadCount: number;
}
