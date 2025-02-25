import { Expense } from "./expense"
import { Income } from "./income"

export interface DashboardStats {
    balance: number
    totalIncome: number
    totalExpense: number
    recentHistory: RecentHistory
    minIncome: Income
    maxIncome: Income
    minExpense: Expense
    maxExpense: Expense
}

export interface RecentHistory {
    income: Income
    expense: Expense
  }
