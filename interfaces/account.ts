import type { ElementType } from "react";
import { IconType } from "react-icons";

export interface Account {
  id: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  spent: number;
  upcomingBills: number;  
  income: number;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
}

export interface QuickStat {
  label: string;
  value: number;
  type: "income" | "expense" | "neutral";
  icon: IconType;
  change?: number;
}
