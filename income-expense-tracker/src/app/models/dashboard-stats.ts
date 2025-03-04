import { Expense } from "./expense"
import { Income } from "./income"

export interface DashboardStats {
    balance: number
    totalIncome: number
    totalExpense: number
    recentHistory: RecentHistory
    minIncome: number
    maxIncome: number
    minExpense: number
    maxExpense: number
}

export interface RecentHistory {
    income: Income
    expense: Expense
  }
