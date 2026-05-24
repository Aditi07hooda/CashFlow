export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  paymentMethod: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  type: "income" | "expense";
}

export type TransactionFromAPI = {
  id: number;
  amount: number;
  note: string | null;

  category: Category;

  transactionType: "INCOME" | "EXPENSE";
  accountType: string;
  transactionDate: string;

  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  amount: number;
  transactionType: "income" | "expense";
  category: string;
  transactionDate: string;
  accountType: string;
  description: string;
}

export interface TransactionReport {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  icon: string;
  color: string;
}