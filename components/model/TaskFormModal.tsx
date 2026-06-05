import React, { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Task, TaskPriority, User, Comment } from "../../types";
import { Trash2, Send } from "lucide-react";
import { ApiService } from "@/services/apiService";
import { socket, SOCKET_EVENTS } from "@/services/socket";
import { mapComment } from "@/helpers/maper";
import { isAdmin } from "@/helpers/projectPermissions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    description: string;
    priority: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
  }) => void;
  task: Task | null;
  canDelete: boolean;
  canManageComments: boolean;
  currentUser: User | null;
  users: User[];
  onRequestDelete: () => void;
}

export const TaskFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  canDelete,
  canManageComments,
  currentUser,
  users,
  onRequestDelete,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) return;
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setAssigneeId(task.assigneeId || "");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
      ApiService.comments
        .list(task.id)
        .then(setComments)
        .catch(() => setCommentError("Failed to load comments"));
    } else {
      setTitle("");
      setDescription("");
      setPriority(TaskPriority.MEDIUM);
      setAssigneeId("");
      setDueDate("");
      setComments([]);
    }
    setCommentText("");
    setCommentError(null);
  }, [task, isOpen]);

  useEffect(() => {
    if (!task || !isOpen) return;

    const handleCommentAdded = (raw: unknown) => {
      const comment = mapComment(raw);
      if (String(comment.taskId) !== String(task.id)) return;
      setComments((prev) =>
        prev.some((c) => String(c.id) === String(comment.id))
          ? prev
          : [comment, ...prev],
      );
    };

    const handleCommentDeleted = (raw: unknown) => {
      if (!raw || typeof raw !== "object") return;
      const payload = raw as { commentId?: string; taskId?: string };
      if (String(payload.taskId) !== String(task.id)) return;
      if (!payload.commentId) return;
      setComments((prev) =>
        prev.filter((c) => String(c.id) !== String(payload.commentId)),
      );
    };

    socket.on(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
    socket.on(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);
    return () => {
      socket.off(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
      socket.off(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);
    };
  }, [task?.id, isOpen]);

  const canDeleteComment = (comment: Comment) => {
    if (!currentUser) return false;
    if (String(comment.authorId) === String(currentUser.id)) return true;
    if (isAdmin(currentUser)) return true;
    return canManageComments;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
    });
  };

  const handleAddComment = async () => {
    if (!task || !commentText.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);
    setCommentError(null);
    try {
      const comment = await ApiService.comments.create(
        task.id,
        commentText.trim(),
      );
      setComments((prev) => [comment, ...prev]);
      setCommentText("");
    } catch (error) {
      setCommentError(
        error instanceof Error ? error.message : "Failed to add comment",
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (deletingCommentId) return;
    setDeletingCommentId(commentId);
    setCommentError(null);
    try {
      await ApiService.comments.delete(commentId);
      setComments((prev) =>
        prev.filter((c) => String(c.id) !== String(commentId)),
      );
    } catch (error) {
      setCommentError(
        error instanceof Error ? error.message : "Failed to delete comment",
      );
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "New Task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as TaskPriority)
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {Object.values(TaskPriority).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assignee
          </label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {task && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Comments
            </h4>
            {commentError && (
              <p className="mb-2 text-xs text-red-600">{commentError}</p>
            )}
            <div className="max-h-32 overflow-y-auto space-y-2 mb-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="text-sm bg-gray-50 p-2 rounded border flex gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium">
                        {c.authorName || "User"}
                      </span>
                      {c.createdAt && (
                        <span className="text-xs text-gray-400 shrink-0">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 break-words">{c.text}</p>
                  </div>
                  {canDeleteComment(c) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(String(c.id))}
                      disabled={deletingCommentId === String(c.id)}
                      className="shrink-0 self-start p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50"
                      aria-label="Delete comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-xs text-gray-400">No comments yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Add a comment..."
                maxLength={1000}
                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAddComment}
                disabled={isSubmittingComment || !commentText.trim()}
                className="p-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-6 pt-2">
          {canDelete ? (
            <button
              type="button"
              onClick={onRequestDelete}
              className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
