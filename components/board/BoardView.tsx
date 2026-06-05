import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import {
  updateTask,
  createTask,
  fetchTasks,
  deleteTask,
  deleteProject,
  fetchAllUsers,
  addProjectMember,
  removeProjectMember,
  fetchProjects,
} from "../../store/slices/helper/dataThunks";
import {
  TaskStatus,
  TaskPriority,
  Task,
  User,
  Project,
  TaskListFilters,
} from "../../types";
import {
  canCreateTask,
  canManageProject,
  canUpdateTask,
  hasProjectAccess,
} from "@/helpers/projectPermissions";
import { BoardColumn } from "./BoardColumn";
import { BoardHeader } from "./BoardHeader";
import { TaskFormModal } from "../model/TaskFormModal";
import { DeleteTaskConfirmModal } from "../model/DeleteTaskConfirmModal";
import { ProjectSettingsModal } from "../model/ProjectSettingsModal";
import { setActiveProjectAction } from "@/store/slices/dataSlice";
import { TASKS_PAGE_LIMIT } from "@/store/slices/helper/taskReducers";
import { SearchBar } from "../search/SearchBar";
import { TaskFilters } from "../search/TaskFilters";
import { SortControls } from "../search/SortControls";
import { Pagination } from "../search/Pagination";

export const BoardView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const { tasks, users, projects, taskPage, taskTotalPages } = useSelector(
    (state: RootState) => state.data
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const projectData = projects.find((p) => p.id === projectId);
  const hasAccess =
    !!projectId &&
    !!projectData &&
    hasProjectAccess(projectId, projects);

  const activeProjectId = React.useMemo(() => {
    if (hasAccess && projectData?.id) return projectData.id;
    return null;
  }, [hasAccess, projectData]);

  const currentProject = React.useMemo(() => {
    if (!activeProjectId) return null;
    return projects.find((p) => p.id === activeProjectId) || null;
  }, [activeProjectId, projects]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [taskFormKey, setTaskFormKey] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "">("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "">("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterDeadline, setFilterDeadline] = useState<
    "" | "UPCOMING" | "OVERDUE"
  >("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadTasks = useCallback(() => {
    if (!activeProjectId) return;
    const filters: TaskListFilters = {
      search: debouncedSearch || undefined,
      status: filterStatus ? [filterStatus] : undefined,
      priority: filterPriority ? [filterPriority] : undefined,
      assignee: filterAssignee || undefined,
      deadlineStatus: filterDeadline || undefined,
      sortBy: sortBy as TaskListFilters["sortBy"],
      sortOrder,
      page,
      limit: TASKS_PAGE_LIMIT,
    };
    dispatch(
      fetchTasks({ projectId: activeProjectId, filters })
    );
  }, [
    activeProjectId,
    debouncedSearch,
    filterStatus,
    filterPriority,
    filterAssignee,
    filterDeadline,
    sortBy,
    sortOrder,
    page,
    dispatch,
  ]);

  useEffect(() => {
    if (!activeProjectId) return;
    dispatch(setActiveProjectAction(activeProjectId));
    dispatch(fetchAllUsers());
  }, [activeProjectId, projectId, dispatch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const canCreate = canCreateTask(currentProject, currentUser);
  const canUpdate = canUpdateTask(currentProject, currentUser);

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    if (!canUpdate) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    dispatch(updateTask({ taskId, updates: { status: newStatus } }));
  };

  const openNewTaskModal = (status: TaskStatus) => {
    if (!canCreate) return;
    setEditingTask(null);
    setNewTaskStatus(status);
    setTaskFormKey((k) => k + 1);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    if (!canUpdate) return;
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateOrUpdateTask = async (payload: {
    title: string;
    description: string;
    priority: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
  }) => {
    if (!projectId || !currentUser) return;

    const taskData = {
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      assigneeId: editingTask
        ? payload.assigneeId === ""
          ? null
          : payload.assigneeId || undefined
        : payload.assigneeId || undefined,
      dueDate: payload.dueDate
        ? new Date(payload.dueDate).toISOString()
        : undefined,
    };

    try {
      if (editingTask) {
        if (!canUpdate) return;
        await dispatch(
          updateTask({ taskId: editingTask.id, updates: taskData }),
        ).unwrap();
      } else {
        if (!canCreate) return;
        await dispatch(
          createTask({
            ...taskData,
            status: newTaskStatus,
            projectId,
            creatorId: currentUser.id,
          }),
        ).unwrap();
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      loadTasks();
    } catch {
      // error shown via data.error banner
    }
  };

  const handleDeleteTask = async () => {
    if (!editingTask?.projectId) return;
    try {
      await dispatch(
        deleteTask({
          taskId: editingTask.id,
          projectId: editingTask.projectId,
        })
      ).unwrap();
      setIsDeleteConfirmOpen(false);
      setIsTaskModalOpen(false);
      setEditingTask(null);
      loadTasks();
    } catch {
      // error stored in state.data.error
    }
  };

  const handleDeleteProject = async () => {
    if (activeProjectId) {
      await dispatch(deleteProject(activeProjectId));
      setIsProjectSettingsOpen(false);
      navigate("/dashboard");
    }
  };

  const handleAddMember = async (userId: string) => {
    if (activeProjectId && userId) {
      const result = await dispatch(
        addProjectMember({ projectId: activeProjectId, userId })
      );
      if (addProjectMember.fulfilled.match(result)) {
        await dispatch(fetchProjects());
        loadTasks();
      }
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (activeProjectId) {
      const result = await dispatch(
        removeProjectMember({ projectId: activeProjectId, userId })
      );
      if (removeProjectMember.fulfilled.match(result)) {
        loadTasks();
      }
    }
  };

  const canManage = canManageProject(currentProject, currentUser);

  const canDeleteTask =
    editingTask &&
    currentUser &&
    (editingTask.creatorId === currentUser.id || canManage);
  // const canDeleteTask = !!(editingTask && canManage);

  const projectMembers: User[] =
    currentProject?.members
      .filter((m) => typeof m.user === "object")
      .map((m) => m.user as User) || [];

  const availableUsers = users.filter(
    (u) =>
      !currentProject?.members.some(
        (m) => (typeof m.user === "object" ? m.user.id : m.user) === u.id
      )
  );

  if (projectId && !hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!activeProjectId && !currentProject) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div id="board-view-component--ts" className="flex flex-col h-full w-full">
      <BoardHeader
        project={currentProject as Project | undefined}
        canManage={!!canManage}
        onOpenProjectSettings={() => setIsProjectSettingsOpen(true)}
      />

      <div className="px-4 sm:px-6 py-3 bg-white border-b border-gray-100 flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} />
        <TaskFilters
          status={filterStatus}
          priority={filterPriority}
          assignee={filterAssignee}
          deadlineStatus={filterDeadline}
          members={projectMembers.map((m) => ({ id: m.id, name: m.name }))}
          onStatusChange={setFilterStatus}
          onPriorityChange={setFilterPriority}
          onAssigneeChange={setFilterAssignee}
          onDeadlineStatusChange={setFilterDeadline}
        />
        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
        />
      </div>

      <div
        id="board-view-body--ts"
        className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6 bg-gray-50"
      >
        <div className="h-full flex gap-4 sm:gap-6 min-w-full lg:min-w-max pb-2">
          {Object.values(TaskStatus).map((status) => (
            <BoardColumn
              key={status}
              title={status.replace("_", " ")}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              users={projectMembers}
              canCreateTask={canCreate}
              canUpdateTask={canUpdate}
              onDropTask={handleDropTask}
              onAddTask={openNewTaskModal}
              onEditTask={openEditTaskModal}
            />
          ))}
        </div>
      </div>

      <Pagination
        page={taskPage}
        totalPages={taskTotalPages}
        onPageChange={setPage}
      />

      <TaskFormModal
        key={editingTask?.id ?? `new-${taskFormKey}`}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        task={editingTask}
        canDelete={!!canDeleteTask}
        canManageComments={!!canManage}
        currentUser={currentUser}
        users={projectMembers}
        onRequestDelete={() => setIsDeleteConfirmOpen(true)}
      />

      <DeleteTaskConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        taskTitle={editingTask?.title || ""}
        onConfirm={handleDeleteTask}
      />

      <ProjectSettingsModal
        isOpen={isProjectSettingsOpen}
        onClose={() => setIsProjectSettingsOpen(false)}
        project={currentProject || null}
        currentUser={currentUser}
        canManage={!!canManage}
        availableUsers={availableUsers}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
};
