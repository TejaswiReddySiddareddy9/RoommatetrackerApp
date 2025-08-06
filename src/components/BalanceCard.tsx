import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Balance, Roommate } from '../types';
import Avatar from './Avatar';

interface BalanceCardProps {
  balance: Balance;
  roommate: Roommate;
  allRoommates: Roommate[];
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, roommate, allRoommates }) => {
  const isPositive = balance.netBalance >= 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Avatar name={roommate.name} color={roommate.color} />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{roommate.name}</h3>
            <p className="text-sm text-gray-500">Balance Summary</p>
          </div>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isPositive 
            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
            : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          ${Math.abs(balance.netBalance).toFixed(2)}
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(balance.owes).filter(([_, amount]) => amount > 0).map(([roommateId, amount]) => {
          const owedRoommate = allRoommates.find(r => r.id === roommateId);
          return owedRoommate ? (
            <div key={roommateId} className="flex items-center justify-between text-sm">
              <div className="flex items-center text-red-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Owes {owedRoommate.name}</span>
              </div>
              <span className="font-medium text-red-600">${amount.toFixed(2)}</span>
            </div>
          ) : null;
        })}

        {Object.entries(balance.owed).filter(([_, amount]) => amount > 0).map(([roommateId, amount]) => {
          const owingRoommate = allRoommates.find(r => r.id === roommateId);
          return owingRoommate ? (
            <div key={roommateId} className="flex items-center justify-between text-sm">
              <div className="flex items-center text-green-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>{owingRoommate.name} owes you</span>
              </div>
              <span className="font-medium text-green-600">${amount.toFixed(2)}</span>
            </div>
          ) : null;
        })}

        {Object.keys(balance.owes).length === 0 && Object.keys(balance.owed).length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">All settled up! 🎉</p>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;