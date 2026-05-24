import { User } from "./account";
import { Budget } from "./budget";
import { Category } from "./category";
import { Transaction } from "./transaction";

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  transactions: Transaction[];
  setTransactions: (txns: Transaction[]) => void;
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void;
  logout: () => void;
}

// ==================== CONTEXT ====================
export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  transactions: Transaction[];
  setTransactions: (txns: Transaction[]) => void;
  categories: Category[];
  budgets: Budget[];
  logout: () => void;
}