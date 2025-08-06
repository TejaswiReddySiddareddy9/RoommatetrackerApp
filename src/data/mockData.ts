import { Roommate, Expense, Task, Payment } from '../types';

export const mockRoommates: Roommate[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@email.com',
    avatar: 'AC',
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    avatar: 'SJ',
    color: '#10B981'
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@email.com',
    avatar: 'MR',
    color: '#F59E0B'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@email.com',
    avatar: 'EW',
    color: '#EF4444'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 120.50,
    paidBy: '1',
    splitBetween: ['1', '2', '3', '4'],
    category: 'Groceries',
    date: '2025-01-10',
    description: 'Weekly grocery run at Whole Foods'
  },
  {
    id: '2',
    title: 'Internet Bill',
    amount: 80.00,
    paidBy: '2',
    splitBetween: ['1', '2', '3', '4'],
    category: 'Utilities',
    date: '2025-01-08'
  },
  {
    id: '3',
    title: 'Cleaning Supplies',
    amount: 45.99,
    paidBy: '3',
    splitBetween: ['1', '2', '3', '4'],
    category: 'Household',
    date: '2025-01-07'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Clean Kitchen',
    description: 'Deep clean kitchen including appliances and counters',
    assignedTo: '2',
    createdBy: '1',
    dueDate: '2025-01-15',
    priority: 'high',
    category: 'Cleaning',
    completed: false
  },
  {
    id: '2',
    title: 'Take Out Trash',
    assignedTo: '3',
    createdBy: '1',
    dueDate: '2025-01-12',
    priority: 'medium',
    category: 'Cleaning',
    completed: true,
    completedDate: '2025-01-11'
  },
  {
    id: '3',
    title: 'Buy Light Bulbs',
    description: 'Replace burned out bulbs in living room',
    assignedTo: '4',
    createdBy: '2',
    dueDate: '2025-01-18',
    priority: 'low',
    category: 'Maintenance',
    completed: false
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    from: '2',
    to: '1',
    amount: 30.13,
    date: '2025-01-09',
    expenseId: '1'
  }
];