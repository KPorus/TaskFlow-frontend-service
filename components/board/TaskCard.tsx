import React from 'react';
import { Task, TaskPriority, User } from '../../types';
import { Calendar, User as UserIcon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onClick: (task: Task) => void;
}

const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const colors = {
    [TaskPriority.LOW]: 'bg-blue-100 text-blue-700',
    [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-700',
    [TaskPriority.HIGH]: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors[priority]}`}>
      {priority}
    </span>
  );
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, onDragStart, onClick }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
    id="task-card--ts"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow mb-3 active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} />
        {assignee && (
           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600" title={assignee.name}>
             {assignee.name.charAt(0)}
           </div>
        )}
      </div>
      <h4 className="text-sm font-semibold text-gray-800 mb-1 leading-tight">{task.title}</h4>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      
      {task.dueDate && (
        <div className={`flex items-center text-xs ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
          <Calendar size={12} className="mr-1" />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};
