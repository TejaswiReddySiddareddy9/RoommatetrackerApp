import React from 'react';
import { DollarSign, Calendar, Users } from 'lucide-react';
import { Expense, Roommate } from '../types';
import Avatar from './Avatar';

interface ExpenseCardProps {
  expense: Expense;
  roommates: Roommate[];
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, roommates }) => {
  const paidByRoommate = roommates.find(r => r.id === expense.paidBy);
  const splitAmount = expense.amount / expense.splitBetween.length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{expense.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{expense.description}</p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="font-medium text-gray-900">${expense.amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(expense.date).toLocaleDateString()}
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-semibold rounded-full border border-blue-300">
              {expense.category}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">Paid by:</span>
              {paidByRoommate && (
                <div className="flex items-center">
                  <Avatar name={paidByRoommate.name} color={paidByRoommate.color} size="sm" />
                  <span className="ml-2 font-medium">{paidByRoommate.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span>${splitAmount.toFixed(2)} each</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;