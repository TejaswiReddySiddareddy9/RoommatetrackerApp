import React, { useState } from 'react';
import { 
  Home, 
  DollarSign, 
  CheckSquare, 
  Users, 
  Plus, 
  Bell,
  TrendingUp,
  Calendar,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { mockRoommates, mockExpenses, mockTasks, mockPayments } from './data/mockData';
import { Expense, Task, Payment, Roommate } from './types';
import { calculateBalances } from './utils/calculations';
import Avatar from './components/Avatar';
import ExpenseCard from './components/ExpenseCard';
import TaskCard from './components/TaskCard';
import BalanceCard from './components/BalanceCard';
import RoommateProfile from './components/RoommateProfile';
import AddExpenseForm from './components/AddExpenseForm';
import AddTaskForm from './components/AddTaskForm';
import AddRoommateForm from './components/AddRoommateForm';

type Tab = 'dashboard' | 'expenses' | 'tasks' | 'balances' | 'roommates';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [roommates, setRoommates] = useState<Roommate[]>(mockRoommates);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [payments] = useState<Payment[]>(mockPayments);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddRoommate, setShowAddRoommate] = useState(false);
  const [editingRoommate, setEditingRoommate] = useState<Roommate | null>(null);
  const currentUserId = roommates[0]?.id || '1'; // Simulating current user

  const balances = calculateBalances(expenses, payments, roommates);
  const currentUserBalance = balances.find(b => b.roommateId === currentUserId);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString()
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const addTask = (newTask: Omit<Task, 'id' | 'completed' | 'completedDate'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false
    };
    setTasks(prev => [task, ...prev]);
  };

  const addRoommate = (newRoommate: Omit<Roommate, 'id'>) => {
    const roommate: Roommate = {
      ...newRoommate,
      id: Date.now().toString()
    };
    setRoommates(prev => [...prev, roommate]);
  };

  const updateRoommate = (updatedRoommate: Omit<Roommate, 'id'>) => {
    if (!editingRoommate) return;
    
    setRoommates(prev => prev.map(roommate => 
      roommate.id === editingRoommate.id 
        ? { ...updatedRoommate, id: editingRoommate.id }
        : roommate
    ));
    setEditingRoommate(null);
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            completedDate: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    ));
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const overdueTasks = pendingTasks.filter(task => new Date(task.dueDate) < new Date());
  const myTasks = tasks.filter(task => task.assignedTo === currentUserId && !task.completed);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const myShare = expenses.reduce((sum, expense) => {
    if (expense.splitBetween.includes(currentUserId)) {
      return sum + (expense.amount / expense.splitBetween.length);
    }
    return sum;
  }, 0);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'balances', label: 'Balances', icon: Users },
    { id: 'roommates', label: 'Roommates', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RoomieTracker
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2 border border-orange-200">
                <Bell className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm text-orange-700 font-medium">
                  {overdueTasks.length} overdue tasks
                </span>
              </div>
              <Avatar 
                name={roommates.find(r => r.id === currentUserId)?.name || 'User'} 
                color={roommates.find(r => r.id === currentUserId)?.color || '#3B82F6'} 
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 mb-8 shadow-lg border border-gray-200">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as Tab)}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">My Share</p>
                    <p className="text-2xl font-bold text-gray-900">${myShare.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">My Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{myTasks.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <CheckSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Net Balance</p>
                    <p className={`text-2xl font-bold ${
                      (currentUserBalance?.netBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(currentUserBalance?.netBalance || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddExpense(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </button>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
              <button
                onClick={() => setShowAddRoommate(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Roommate
              </button>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Expenses */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h2>
                <div className="space-y-4">
                  {expenses.slice(0, 3).map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} roommates={roommates} />
                  ))}
                </div>
              </div>

              {/* Pending Tasks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
                  {overdueTasks.length > 0 && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {overdueTasks.length} overdue
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {pendingTasks.slice(0, 3).map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      roommates={roommates}
                      onToggleComplete={toggleTaskComplete}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
              <button
                onClick={() => setShowAddExpense(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </button>
            </div>
            <div className="space-y-4">
              {expenses.map(expense => (
                <ExpenseCard key={expense.id} expense={expense} roommates={roommates} />
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>

            {/* Task Filters */}
            <div className="flex space-x-4 mb-6">
              <span className="text-sm text-gray-600">Filter:</span>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium border border-blue-300">
                All ({tasks.length})
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Pending ({pendingTasks.length})
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Completed ({tasks.filter(t => t.completed).length})
              </button>
              {overdueTasks.length > 0 && (
                <button className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full text-sm font-medium hover:from-red-200 hover:to-red-300 transition-all border border-red-300">
                  Overdue ({overdueTasks.length})
                </button>
              )}
            </div>

            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  roommates={roommates}
                  onToggleComplete={toggleTaskComplete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Roommates Tab */}
        {activeTab === 'roommates' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Roommates</h2>
              <button
                onClick={() => setShowAddRoommate(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Roommate
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roommates.map(roommate => {
                const roommateBalance = balances.find(b => b.roommateId === roommate.id);
                const roommateTasks = tasks.filter(task => task.assignedTo === roommate.id);
                const roommateExpenses = expenses.filter(expense => expense.paidBy === roommate.id);
                
                return (
                  <RoommateProfile
                    key={roommate.id}
                    roommate={roommate}
                    balance={roommateBalance || { roommateId: roommate.id, owes: {}, owed: {}, netBalance: 0 }}
                    tasks={roommateTasks}
                    expenses={roommateExpenses}
                    onEdit={(roommate) => setEditingRoommate(roommate)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Balances Tab */}
        {activeTab === 'balances' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Balances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {balances.map(balance => {
                const roommate = roommates.find(r => r.id === balance.roommateId);
                return roommate ? (
                  <BalanceCard 
                    key={balance.roommateId}
                    balance={balance}
                    roommate={roommate}
                    allRoommates={roommates}
                  />
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddExpense && (
        <AddExpenseForm
          roommates={roommates}
          onSubmit={addExpense}
          onClose={() => setShowAddExpense(false)}
        />
      )}

      {showAddTask && (
        <AddTaskForm
          roommates={roommates}
          currentUser={currentUserId}
          onSubmit={addTask}
          onClose={() => setShowAddTask(false)}
        />
      )}

      {(showAddRoommate || editingRoommate) && (
        <AddRoommateForm
          onSubmit={editingRoommate ? updateRoommate : addRoommate}
          onClose={() => {
            setShowAddRoommate(false);
            setEditingRoommate(null);
          }}
          existingRoommate={editingRoommate || undefined}
        />
      )}
    </div>
  );
}

export default App;