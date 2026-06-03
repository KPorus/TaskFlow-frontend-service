import React, { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Task, TaskPriority, User, Comment } from "../../types";
import { Trash2, Send } from "lucide-react";
import { ApiService } from "@/services/apiService";

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
  users: User[];
  onRequestDelete: () => void;
}

export const TaskFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  canDelete,
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

  useEffect(() => {
    if (!isOpen) return;
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setAssigneeId(task.assigneeId || "");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
      ApiService.comments.list(task.id).then(setComments).catch(() => {});
    } else {
      setTitle("");
      setDescription("");
      setPriority(TaskPriority.MEDIUM);
      setAssigneeId("");
      setDueDate("");
      setComments([]);
    }
    setCommentText("");
  }, [task, isOpen]);

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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !commentText.trim()) return;
    const comment = await ApiService.comments.create(task.id, commentText);
    setComments((prev) => [comment, ...prev]);
    setCommentText("");
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
            <div className="max-h-32 overflow-y-auto space-y-2 mb-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="text-sm bg-gray-50 p-2 rounded border"
                >
                  <span className="font-medium">{c.authorName || "User"}</span>
                  <p className="text-gray-600">{c.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-xs text-gray-400">No comments yet</p>
              )}
            </div>
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 text-white rounded-md"
              >
                <Send size={16} />
              </button>
            </form>
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
