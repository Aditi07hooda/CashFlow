import { Budget } from "@/interfaces/budget";
import { Category, CategorySpending, MonthlyData } from "@/interfaces/category";
import { Transaction, TransactionReport } from "@/interfaces/transaction";

export const MOCK_BUDGETS: Budget[] = [
  {
    id: "1",
    categoryId: "3",
    categoryName: "Food",
    limit: 10000,
    spent: 2500,
    month: "2026-01",
  },
  {
    id: "2",
    categoryId: "4",
    categoryName: "Transport",
    limit: 5000,
    spent: 800,
    month: "2026-01",
  },
  {
    id: "3",
    categoryId: "5",
    categoryName: "Shopping",
    limit: 15000,
    spent: 15000,
    month: "2026-01",
  },
  {
    id: "4",
    categoryId: "6",
    categoryName: "Bills",
    limit: 8000,
    spent: 0,
    month: "2026-01",
  },
];

export const topTransactions: TransactionReport[] = [
  {
    id: "1",
    date: "2026-02-20",
    category: "Grocery",
    amount: 3500,
    type: "expense",
    description: "Monthly groceries",
    icon: "🛒",
    color: "#EF4444",
  },
  {
    id: "2",
    date: "2026-02-18",
    category: "Salary",
    amount: 75000,
    type: "income",
    description: "Monthly salary",
    icon: "💰",
    color: "#10B981",
  },
  {
    id: "3",
    date: "2026-02-15",
    category: "Restaurant",
    amount: 2800,
    type: "expense",
    description: "Dinner with family",
    icon: "🍽️",
    color: "#F59E0B",
  },
  {
    id: "4",
    date: "2026-02-12",
    category: "Shopping",
    amount: 5200,
    type: "expense",
    description: "New clothes",
    icon: "👕",
    color: "#8B5CF6",
  },
  {
    id: "5",
    date: "2026-02-10",
    category: "Freelance",
    amount: 15000,
    type: "income",
    description: "Design project",
    icon: "💼",
    color: "#10B981",
  },
];

export const MOCK_MONTHLY_DATA: MonthlyData[] = [
  { month: "Aug", income: 120000, expense: 85000 },
  { month: "Sep", income: 135000, expense: 92000 },
  { month: "Oct", income: 128000, expense: 88000 },
  { month: "Nov", income: 145000, expense: 95000 },
  { month: "Dec", income: 150000, expense: 102000 },
  { month: "Jan", income: 142000, expense: 89000 },
];

export const MOCK_CATEGORY_SPENDING: CategorySpending[] = [];

export const MOCK_CATEGORIES: Category[] = [];

export const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 75000, type: 'income', category: 'Salary', date: '2026-02-01', paymentMethod: 'Net Banking', description: 'Monthly salary', icon: '💰', color: '#10B981' },
  { id: '2', amount: 3500, type: 'expense', category: 'Food & Dining', date: '2026-02-20', paymentMethod: 'Credit Card', description: 'Grocery shopping', icon: '🍔', color: '#EF4444' },
  { id: '3', amount: 1200, type: 'expense', category: 'Transportation', date: '2026-02-19', paymentMethod: 'UPI', description: 'Uber rides', icon: '🚗', color: '#F59E0B' },
  { id: '4', amount: 15000, type: 'income', category: 'Freelance', date: '2026-02-18', paymentMethod: 'Net Banking', description: 'Web design project', icon: '💼', color: '#3B82F6' },
  { id: '5', amount: 5200, type: 'expense', category: 'Shopping', date: '2026-02-15', paymentMethod: 'Credit Card', description: 'New clothes', icon: '🛍️', color: '#EC4899' },
  { id: '6', amount: 2800, type: 'expense', category: 'Entertainment', date: '2026-02-14', paymentMethod: 'Credit Card', description: 'Movie and dinner', icon: '🎬', color: '#8B5CF6' },
  { id: '7', amount: 4500, type: 'expense', category: 'Bills & Utilities', date: '2026-02-10', paymentMethod: 'Net Banking', description: 'Electricity bill', icon: '⚡', color: '#14B8A6' },
  { id: '8', amount: 8000, type: 'expense', category: 'Healthcare', date: '2026-02-08', paymentMethod: 'Debit Card', description: 'Medical checkup', icon: '💊', color: '#F43F5E' },
  { id: '9', amount: 20000, type: 'income', category: 'Investment', date: '2026-02-05', paymentMethod: 'Net Banking', description: 'Stock dividend', icon: '📈', color: '#8B5CF6' },
  { id: '10', amount: 6500, type: 'expense', category: 'Education', date: '2026-02-03', paymentMethod: 'Credit Card', description: 'Online course', icon: '📚', color: '#6366F1' },
];
