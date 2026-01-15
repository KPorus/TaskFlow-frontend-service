import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import {
  updateTask,
  createTask,
  fetchTasks,
  deleteTask,
  deleteTeam,
  fetchAllUsers,
  addTeamMember,
  removeTeamMember,
} from "../../store/slices/helper/dataThunks";
import { TaskStatus, TaskPriority, Task, User, Team } from "../../types";
import { BoardColumn } from "./BoardColumn";
import { BoardHeader } from "./BoardHeader";
import { TaskFormModal } from "../model/TaskFormModal";
import { DeleteTaskConfirmModal } from "../model/DeleteTaskConfirmModal";
import { TeamSettingsModal } from "../model/TeamSettingsModal";
import { setActiveTeamAction } from "@/store/slices/dataSlice";

interface DashboardContext {
  setSidebarOpen: (isOpen: boolean) => void;
}

export const BoardView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const { setSidebarOpen } = useOutletContext<DashboardContext>();

  const { tasks, users, teams } = useSelector((state: RootState) => state.data);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const currentTeam = teams.find((t) => t.id === teamId);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isTeamSettingsOpen, setIsTeamSettingsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>(
    TaskStatus.TODO
  );

  useEffect(() => {
    if (teamId) {
      dispatch(setActiveTeamAction(teamId));
      dispatch(fetchTasks(teamId));
      dispatch(fetchAllUsers());
    }
  }, [teamId, dispatch]);

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    dispatch(
      updateTask({
        taskId,
        updates: { status: newStatus },
      })
    );
  };

  const openNewTaskModal = (status: TaskStatus) => {
    setEditingTask(null);
    setNewTaskStatus(status);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
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
    if (!teamId || !currentUser) return;

    const taskData = {
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      assigneeId: payload.assigneeId || undefined,
      dueDate: payload.dueDate
        ? new Date(payload.dueDate).toISOString()
        : undefined,
    };

    if (editingTask) {
      await dispatch(
        updateTask({
          taskId: editingTask.id,
          updates: taskData,
        })
      );
    } else {
      await dispatch(
        createTask({
          ...taskData,
          status: newTaskStatus,
          teamId,
          creatorId: currentUser.id,
        })
      );
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async () => {
    if (editingTask && editingTask.teamId) {
      await dispatch(
        deleteTask({ taskId: editingTask.id, teamId: editingTask.teamId })
      );
      setIsDeleteConfirmOpen(false);
      setIsTaskModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleDeleteTeam = async () => {
    if (teamId) {
      await dispatch(deleteTeam(teamId));
      setIsTeamSettingsOpen(false);
      navigate("/dashboard");
    }
  };

  const handleAddMember = async (userId: string) => {
    if (teamId && userId) {
      await dispatch(addTeamMember({ teamId, userId }));
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (teamId) {
      await dispatch(removeTeamMember({ teamId, userId }));
    }
  };

  const canDelete =
    editingTask &&
    currentUser &&
    (editingTask.creatorId === currentUser.id ||
      currentTeam?.ownerId === currentUser.id);
  const isOwner = currentUser && currentTeam?.ownerId === currentUser.id;

  const teamMembers: User[] =
    currentTeam?.members
      .filter((m) => typeof m.user === "object")
      .map((m) => m.user as User) || [];

  const availableUsers = users.filter(
    (u) => !currentTeam?.members.some(
      (m) => (typeof m.user === "object" ? m.user.id : m.user) === u.id
    )
  );

  return (
    <div id="board-view-component--ts" className="flex flex-col h-full w-full">
      <BoardHeader
        team={currentTeam as Team | undefined}
        isOwner={!!isOwner}
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenTeamSettings={() => setIsTeamSettingsOpen(true)}
      />

      <div id="board-view-body--ts" className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6 bg-gray-50">
        <div className="h-full flex gap-4 sm:gap-6 min-w-full lg:min-w-max pb-2">
          {Object.values(TaskStatus).map((status) => (
            <BoardColumn
              key={status}
              title={status.replace("_", " ")}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              users={teamMembers}
              onDropTask={handleDropTask}
              onAddTask={openNewTaskModal}
              onEditTask={openEditTaskModal}
            />
          ))}
        </div>
      </div>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        task={editingTask}
        canDelete={!!canDelete}
        users={teamMembers}
        onRequestDelete={() => setIsDeleteConfirmOpen(true)}
      />

      <DeleteTaskConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        taskTitle={editingTask?.title || ""}
        onConfirm={handleDeleteTask}
      />

      <TeamSettingsModal
        isOpen={isTeamSettingsOpen}
        onClose={() => setIsTeamSettingsOpen(false)}
        team={currentTeam || null}
        currentUser={currentUser}
        isOwner={!!isOwner}
        availableUsers={availableUsers}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onDeleteTeam={handleDeleteTeam}
      />
    </div>
  );
};