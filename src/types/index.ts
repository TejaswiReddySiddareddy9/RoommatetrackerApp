export interface Roommate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  category: string;
  date: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  createdBy: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  completedDate?: string;
}

export interface Payment {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  expenseId?: string;
}

export interface Balance {
  roommateId: string;
  owes: { [key: string]: number };
  owed: { [key: string]: number };
  netBalance: number;
}