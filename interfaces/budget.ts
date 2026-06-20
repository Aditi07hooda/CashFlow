import { Category } from "./transaction";

export interface Budget {
  id: string;
  amount: number;
  startDate: string;
  endDate: string;
  budgetPeriod: BUDGET_PERIOD;
  categoryNames: string[];
  description?: string;
}

export interface CreateBudgetData {
  amount: number;
  startDate: string;
  endDate: string;
  budgetPeriod: BUDGET_PERIOD;
  categoryNames: string[];
  description?: string;
}

export interface BudgetResponse {
  id: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  categories: Category[];
  period: BUDGET_PERIOD;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export enum BUDGET_PERIOD {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  CUSTOM = "CUSTOM",
}
