import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import { logoutUser } from "@/store/slices/helper/authThunks";
import { Layout, LogOut, Plus, Hash, X, LayoutDashboard } from "lucide-react";
import { Modal } from "../ui/Modal";
import { createProject, fetchProjects } from "@/store/slices/helper/dataThunks";
import { canCreateProject, isAdmin } from "@/helpers/projectPermissions";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId: activeProjectId } = useParams<{ projectId: string }>();
  const isDashboardHome =
    location.pathname === "/dashboard" ||
    location.pathname === "/dashboard/";

  const { projects } = useSelector((state: RootState) => state.data);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const showCreateProject = canCreateProject(user);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const resultAction = await dispatch(
        createProject({ name: newProjectName })
      );
      if (createProject.fulfilled.match(resultAction)) {
        setNewProjectName("");
        setIsProjectModalOpen(false);
        onClose();
        dispatch(fetchProjects());
        navigate(`/dashboard/projects/${resultAction.payload.id}`);
      }
    }
  };

  const handleProjectClick = (id: string) => {
    navigate(`/dashboard/projects/${id}`);
    onClose();
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <>
      <div
        id="sideber-component-ts"
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded text-white">
              <Layout size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2 mb-4">
            <button
              onClick={() => {
                navigate("/dashboard");
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isDashboardHome && !activeProjectId
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <LayoutDashboard size={16} className="opacity-70" />
              <span>Dashboard</span>
            </button>
          </div>
          <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Projects
          </div>
          <div className="space-y-1 px-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeProjectId === project.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Hash size={16} className="opacity-70" />
                <span className="truncate">{project.name}</span>
              </button>
            ))}

            {showCreateProject && (
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors border-t border-slate-800 mt-2 pt-3"
              >
                <Plus size={16} />
                <span>Create Project</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email}
                {isAdmin(user) && (
                  <span className="ml-1 text-amber-400">· Admin</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              required
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Website Redesign"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
