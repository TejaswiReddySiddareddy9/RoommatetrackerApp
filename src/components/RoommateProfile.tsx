import React from 'react';
import { Mail, Calendar, DollarSign, CheckSquare, TrendingUp, TrendingDown, Edit3 } from 'lucide-react';
import { Roommate, Balance, Task, Expense } from '../types';
import Avatar from './Avatar';

interface RoommateProfileProps {
  roommate: Roommate;
  balance: Balance;
  tasks: Task[];
  expenses: Expense[];
  onEdit: (roommate: Roommate) => void;
}

const RoommateProfile: React.FC<RoommateProfileProps> = ({ 
  roommate, 
  balance, 
  tasks, 
  expenses,
  onEdit 
}) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = tasks.filter(task => !task.completed && new Date(task.dueDate) < new Date()).length;
  
  const totalPaid = expenses
    .filter(expense => expense.paidBy === roommate.id)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const joinDate = new Date(2024, 0, 15); // Mock join date

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header with gradient background */}
      <div 
        className="h-24 relative"
        style={{
          background: `linear-gradient(135deg, ${roommate.color}20, ${roommate.color}40)`
        }}
      >
        <div className="absolute -bottom-8 left-6">
          <div className="relative">
            <Avatar name={roommate.name} color={roommate.color} size="lg" />
            <div 
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center"
              style={{ backgroundColor: roommate.color }}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <button
          onClick={() => onEdit(roommate)}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="pt-12 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{roommate.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Mail className="w-4 h-4 mr-2" />
            <span className="text-sm">{roommate.email}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">Joined {joinDate.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Net Balance</p>
                <p className={`text-lg font-bold ${
                  balance.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {balance.netBalance >= 0 ? '+' : '-'}${Math.abs(balance.netBalance).toFixed(2)}
                </p>
              </div>
              {balance.netBalance >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-500" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-500" />
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Total Paid</p>
                <p className="text-lg font-bold text-gray-900">${totalPaid.toFixed(2)}</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Tasks Done</p>
                <p className="text-lg font-bold text-gray-900">{completedTasks}</p>
              </div>
              <CheckSquare className="w-6 h-6 text-orange-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Pending</p>
                <p className="text-lg font-bold text-gray-900">{pendingTasks}</p>
                {overdueTasks > 0 && (
                  <p className="text-xs text-red-600 font-medium">{overdueTasks} overdue</p>
                )}
              </div>
              <CheckSquare className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Balance Details */}
        {(Object.keys(balance.owes).length > 0 || Object.keys(balance.owed).length > 0) && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Balance Details</h4>
            <div className="space-y-2">
              {Object.entries(balance.owes).filter(([_, amount]) => amount > 0).map(([roommateId, amount]) => (
                <div key={roommateId} className="flex items-center justify-between text-sm">
                  <span className="text-red-600">Owes roommate</span>
                  <span className="font-medium text-red-600">${amount.toFixed(2)}</span>
                </div>
              ))}
              {Object.entries(balance.owed).filter(([_, amount]) => amount > 0).map(([roommateId, amount]) => (
                <div key={roommateId} className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Owed by roommate</span>
                  <span className="font-medium text-green-600">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoommateProfile;