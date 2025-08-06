import React from 'react';
import { Clock, Flag, CheckCircle, Circle, Calendar } from 'lucide-react';
import { Task, Roommate } from '../types';
import Avatar from './Avatar';

interface TaskCardProps {
  task: Task;
  roommates: Roommate[];
  onToggleComplete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, roommates, onToggleComplete }) => {
  const assignedRoommate = roommates.find(r => r.id === task.assignedTo);
  const createdByRoommate = roommates.find(r => r.id === task.createdBy);
  
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 ${
      task.completed ? 'border-green-200' : isOverdue ? 'border-red-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <button
              onClick={() => onToggleComplete(task.id)}
              className="mr-3 hover:scale-110 transition-transform"
            >
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 hover:text-green-500" />
              )}
            </button>
            <h3 className={`font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-3 ml-8">{task.description}</p>
          )}

          <div className="flex items-center space-x-4 mb-3 ml-8">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span className={isOverdue && !task.completed ? 'text-red-600 font-medium' : ''}>
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
              <Flag className="w-3 h-3 inline mr-1" />
              {task.priority}
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs font-semibold rounded-full border border-gray-300">
              {task.category}
            </span>
          </div>

          <div className="flex items-center justify-between ml-8">
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">Assigned to:</span>
              {assignedRoommate && (
                <div className="flex items-center">
                  <Avatar name={assignedRoommate.name} color={assignedRoommate.color} size="sm" />
                  <span className="ml-2 font-medium">{assignedRoommate.name}</span>
                </div>
              )}
            </div>
            {task.completed && task.completedDate && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed {new Date(task.completedDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;