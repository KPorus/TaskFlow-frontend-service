import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { Layout, LogOut, Plus, Hash, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { createTeam } from '@/store/slices/helper/dataThunks';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { teamId: activeTeamId } = useParams<{ teamId: string }>(); 
  
  const { teams } = useSelector((state: RootState) => state.data);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      const resultAction = await dispatch(createTeam({ name: newTeamName }));
      if (createTeam.fulfilled.match(resultAction)) {
        setNewTeamName('');
        setIsTeamModalOpen(false);
        onClose();
        navigate(`/dashboard/${resultAction.payload.id}`);
      }
    }
  };

  const handleTeamClick = (teamId: string) => {
    navigate(`/dashboard/${teamId}`);
    onClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <div id="sideber-component-ts"
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 
          transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded text-white">
              <Layout size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Teams
          </div>
          <div className="space-y-1 px-2">
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTeamId === team.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Hash size={16} className="opacity-70" />
                <span className="truncate">{team.name}</span>
              </button>
            ))}
            
            <button 
              onClick={() => setIsTeamModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors border-t border-slate-800 mt-2 pt-3"
            >
              <Plus size={16} />
              <span>Create Team</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-medium text-white truncate">{user?.name}</p>
               <p className="text-xs text-slate-400 truncate">{user?.email}</p>
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

      <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title="Create New Team">
        <form onSubmit={handleCreateTeam} className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-gray-700">Team Name</label>
            <input
              type="text"
              required
              value={newTeamName}
              onChange={e => setNewTeamName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Design Team"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsTeamModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Team
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};