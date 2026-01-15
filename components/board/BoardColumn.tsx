import React from 'react';
import { Task, TaskStatus, User } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface BoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  users: User[];
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({ 
  title, 
  status, 
  tasks, 
  users, 
  onDropTask,
  onAddTask,
  onEditTask
}) => {
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onDropTask(taskId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const getAssignee = (id?: string) => users.find(u => u.id === id);

  return (
    <div id="board-view-body-column--ts"
      className="flex flex-col bg-gray-100 rounded-lg w-[85vw] sm:w-80 h-full max-h-full flex-shrink-0 snap-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-3 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-2">
           <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
           <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">{tasks.length}</span>
        </div>
        <button 
          onClick={() => onAddTask(status)}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1 rounded transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div id="task-card-component--ts" className="flex-1 p-2 overflow-y-auto no-scrollbar">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            assignee={getAssignee(task.assigneeId)}
            onDragStart={handleDragStart}
            onClick={onEditTask}
          />
        ))}
        {tasks.length === 0 && (
            <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                Drop tasks here
            </div>
        )}
      </div>
    </div>
  );
};