import {
  Project,
  ProjectRoleOnProject,
  Task,
  User,
  Comment,
  Activity,
  Notification,
} from "@/types";
import { getId } from "./getId";

export const mapProject = (t: any): Project => {
  if (!t) return null as any;
  return {
    id: t._id || t.id,
    name: t.name,
    description: t.description,
    deadline: t.deadline,
    status: t.status || "ACTIVE",
    ownerId: getId(t.owner),
    members: (t.members || []).map((m: any) => ({
      user:
        typeof m.user === "object" && m.user !== null
          ? {
              id: m.user._id || m.user.id,
              name: m.user.name,
              email: m.user.email,
              role: m.user.role,
            }
          : m.user,
    })),
    roleOnProject: t.roleOnProject as ProjectRoleOnProject | undefined,
  };
};

export const mapTask = (t: any): Task => {
  if (!t) return null as any;
  return {
    id: t._id || t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    assigneeId: getId(t.assignee),
    projectId: getId(t.project) || getId(t.team),
    creatorId: getId(t.creator),
    dueDate: t.dueDate,
    createdAt: t.createdAt,
  };
};

export const mapUser = (u: any): User => {
  return {
    id: u._id || u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  };
};

export const mapComment = (c: any): Comment => ({
  id: c._id || c.id,
  taskId: getId(c.task),
  authorId: getId(c.author),
  authorName: c.author?.name,
  text: c.text,
  createdAt: c.createdAt,
});

export const mapActivity = (a: any): Activity => ({
  id: a._id || a.id,
  type: a.type,
  message: a.message,
  createdAt: a.createdAt,
  actorName: a.actor?.name,
});

export const mapNotification = (n: any): Notification => ({
  id: n._id || n.id,
  type: n.type,
  message: n.message,
  link: n.link,
  read: n.read,
  createdAt: n.createdAt,
});
