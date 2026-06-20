"use client";

import React, { useState } from "react";

import { AlertCircle, Check } from "lucide-react";

import { BudgetResponse, CreateBudgetData } from "@/interfaces/budget";

import { TransactionFromAPI } from "@/interfaces/transaction";

import BudgetHeader from "./BudgetHeader";
import BudgetCard from "./BudgetCard";
import BudgetList from "./BudgetList";
import AddBudgetModal from "./AddBudgetModal";

import { useBudget } from "@/hooks/useBudget";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";

const BudgetComponent = () => {
  const { budgets = [], isLoading, isError, createBudget } = useBudget();

  const { data: categories = [] } = useCategories();

  const { transactions = [] } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingBudget, setEditingBudget] = useState<BudgetResponse | null>(
    null,
  );

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const expenseCategories = categories.filter(
    (category) => category.type === "expense",
  );

  const parseTransactionDate = (dateString: string) => {
    // handles dd/mm/yyyy
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");

      return new Date(Number(year), Number(month) - 1, Number(day));
    }

    return new Date(dateString);
  };

  const calculateSpent = (
    categoryIds: number[] = [],
    startDate: string,
    endDate: string,
  ) => {
    const start = new Date(startDate);

    const end = new Date(endDate);

    end.setHours(23, 59, 59, 999);

    return (
      transactions
        .filter((transaction: TransactionFromAPI) => {
          const transactionDate = parseTransactionDate(
            transaction.transactionDate,
          );

          return (
            categoryIds.includes(Number(transaction.category?.categoryId)) &&
            transaction.transactionType === "EXPENSE" &&
            transactionDate >= start &&
            transactionDate <= end
          );
        })
        .reduce(
          (sum: number, transaction: TransactionFromAPI) =>
            sum + Number(transaction.amount || 0),
          0,
        ) || 0
    );
  };

  const currentBudgets: BudgetResponse[] =
    budgets
      ?.filter((budget: BudgetResponse) => {
        return budget.startDate?.slice(0, 7) === selectedMonth;
      })
      ?.map((budget: BudgetResponse) => ({
        ...budget,

        amount: Number(budget.budget),

        budgetPeriod: budget.period,

        categoryNames: budget.categories?.map((cat) => cat.categoryName) || [],

        spent: calculateSpent(
          budget.categories?.map((cat) => cat.categoryId) || [],
          budget.startDate,
          budget.endDate,
        ),
      })) || [];

  const resetForm = () => {
    setEditingBudget(null);
  };

  const handleSubmit = async (budgetData: CreateBudgetData) => {
    await createBudget(budgetData);

    setIsModalOpen(false);

    resetForm();
  };

  const handleEdit = (budget: BudgetResponse) => {
    setEditingBudget(budget);

    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log(id);

    // delete API call
  };

  const getProgressColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;

    if (percentage >= 100) return "bg-red-500";

    if (percentage >= 80) return "bg-amber-500";

    return "bg-green-500";
  };

  const getStatusIcon = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;

    if (percentage >= 100) {
      return <AlertCircle className="text-red-500" size={18} />;
    }

    if (percentage >= 80) {
      return <AlertCircle className="text-amber-500" size={18} />;
    }

    return <Check className="text-green-500" size={18} />;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Failed to load budgets
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden px-4 lg:px-8">
      <BudgetHeader
        onAddBudget={() => {
          setEditingBudget(null);

          setIsModalOpen(true);
        }}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <BudgetCard currentBudgets={currentBudgets} />

      <BudgetList
        currentBudgets={currentBudgets}
        categories={expenseCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getStatusIcon={getStatusIcon}
        getProgressColor={getProgressColor}
      />

      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);

          resetForm();
        }}
        onSubmit={handleSubmit}
        editingBudget={editingBudget}
        categories={expenseCategories}
      />
    </div>
  );
};

export default BudgetComponent;
