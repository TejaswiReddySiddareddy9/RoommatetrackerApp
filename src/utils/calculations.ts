import { Expense, Payment, Balance, Roommate } from '../types';

export function calculateBalances(expenses: Expense[], payments: Payment[], roommates: Roommate[]): Balance[] {
  const balances: { [key: string]: Balance } = {};

  // Initialize balances for all roommates
  roommates.forEach(roommate => {
    balances[roommate.id] = {
      roommateId: roommate.id,
      owes: {},
      owed: {},
      netBalance: 0
    };
  });

  // Calculate expenses
  expenses.forEach(expense => {
    const splitAmount = expense.amount / expense.splitBetween.length;
    
    expense.splitBetween.forEach(roommateId => {
      if (roommateId !== expense.paidBy) {
        // This roommate owes money to the payer
        if (!balances[roommateId].owes[expense.paidBy]) {
          balances[roommateId].owes[expense.paidBy] = 0;
        }
        balances[roommateId].owes[expense.paidBy] += splitAmount;

        // The payer is owed money by this roommate
        if (!balances[expense.paidBy].owed[roommateId]) {
          balances[expense.paidBy].owed[roommateId] = 0;
        }
        balances[expense.paidBy].owed[roommateId] += splitAmount;
      }
    });
  });

  // Subtract payments
  payments.forEach(payment => {
    // Reduce what the payer owes
    if (balances[payment.from].owes[payment.to]) {
      balances[payment.from].owes[payment.to] -= payment.amount;
      if (balances[payment.from].owes[payment.to] <= 0) {
        delete balances[payment.from].owes[payment.to];
      }
    }

    // Reduce what the receiver is owed
    if (balances[payment.to].owed[payment.from]) {
      balances[payment.to].owed[payment.from] -= payment.amount;
      if (balances[payment.to].owed[payment.from] <= 0) {
        delete balances[payment.to].owed[payment.from];
      }
    }
  });

  // Calculate net balances
  Object.values(balances).forEach(balance => {
    const totalOwed = Object.values(balance.owed).reduce((sum, amount) => sum + amount, 0);
    const totalOwes = Object.values(balance.owes).reduce((sum, amount) => sum + amount, 0);
    balance.netBalance = totalOwed - totalOwes;
  });

  return Object.values(balances);
}