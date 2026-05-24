export interface Category {
  categoryId: string;
  categoryName: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isCustom: boolean;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
  change: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}