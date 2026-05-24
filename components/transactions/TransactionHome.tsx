"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  TrendingUp,
} from "lucide-react";

import TransactionModal from "@/components/transactions/TransactionModal";

import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";

import {
  TransactionFormData,
  TransactionFromAPI,
} from "@/interfaces/transaction";

import { Category } from "@/interfaces/category";
import { CATEGORY_ICONS } from "@/data/categoryIcons";
import PieChartCard from "../ui/charts/PieChartCard";
import TransactionTable from "./TransactionTable";

const TransactionHome: React.FC = () => {
  const [hideBalance, setHideBalance] = useState(false);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense",
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );

  const [filterCategory, setFilterCategory] = useState("all");

  const [dateRangeStart, setDateRangeStart] = useState("");

  const [dateRangeEnd, setDateRangeEnd] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const {
    transactions,
    totalIncome,
    totalSpent,
    createTransaction,
    deleteTransaction,
    isLoading,
  } = useTransactions();

  const { data: categories = [] } = useCategories();

  const formatCurrency = (amount: number) => {
    return hideBalance
      ? "₹ •••••"
      : `₹ ${amount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
  };

  const filteredTransactions = transactions.filter(
    (txn: TransactionFromAPI) => {
      const matchesSearch =
        txn.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.category.categoryName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesType =
        filterType === "all" ||
        txn.transactionType.toLowerCase() === filterType;

      const matchesCategory =
        filterCategory === "all" ||
        txn.category.categoryName === filterCategory;

      const matchesDateRange =
        (!dateRangeStart || txn.transactionDate >= dateRangeStart) &&
        (!dateRangeEnd || txn.transactionDate <= dateRangeEnd);

      return (
        matchesSearch && matchesType && matchesCategory && matchesDateRange
      );
    },
  );

  const buildCategoryData = (
    transactions: TransactionFromAPI[],
    colors: string[],
    legendColors: string[],
  ) => {
    const grouped: Record<string, number> = {};

    transactions.forEach((txn) => {
      const category = txn.category.categoryName;

      grouped[category] = (grouped[category] || 0) + txn.amount;
    });

    return Object.entries(grouped).map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length],
      legendColor: legendColors[index % legendColors.length],
    }));
  };

  const incomeTransactions = filteredTransactions.filter(
    (t: TransactionFromAPI) => t.transactionType === "INCOME",
  );

  const expenseTransactions = filteredTransactions.filter(
    (t: TransactionFromAPI) => t.transactionType === "EXPENSE",
  );

  const incomeCategoryData = buildCategoryData(
    incomeTransactions,
    ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899"],
    [
      "bg-green-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
    ],
  );

  const expenseCategoryData = buildCategoryData(
    expenseTransactions,
    ["#EF4444", "#F97316", "#EAB308", "#EC4899", "#8B5CF6"],
    [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-purple-500",
    ],
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleAddTransaction = async (transaction: TransactionFormData) => {
    await createTransaction(transaction);

    setIsTransactionModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Transactions
            </h1>

            <p className="text-gray-600">Manage all your income and expenses</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {hideBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>

            <button
              onClick={() => {
                setTransactionType("expense");
                setIsTransactionModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-green-600 hover:shadow-xl hover:scale-105 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />

              <span>Add Expense</span>
            </button>

            <button
              onClick={() => {
                setTransactionType("income");
                setIsTransactionModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-500 to-red-600 hover:shadow-xl hover:scale-105 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />

              <span>Add Income</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards with Pie Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 items-stretch">
        {/* Financial Overview */}
        <PieChartCard
          title="Financial Overview"
          formatCurrency={formatCurrency}
          data={[
            {
              label: "Income",
              value: totalIncome,
              color: "#10B981",
              legendColor: "bg-green-500",
            },
            {
              label: "Expense",
              value: totalSpent,
              color: "#EF4444",
              legendColor: "bg-red-500",
            },
          ]}
        />

        {/* Income Categories */}
        <PieChartCard
          title="Income Categories"
          formatCurrency={formatCurrency}
          data={incomeCategoryData}
        />

        {/* Expense Categories */}
        <PieChartCard
          title="Expense Categories"
          formatCurrency={formatCurrency}
          data={expenseCategoryData}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as "all" | "income" | "expense");

                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>

              <option value="income">Income</option>

              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);

                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>

              {categories.map((cat: Category) => (
                <option key={cat.categoryId} value={cat.categoryName}>
                  {CATEGORY_ICONS[cat.categoryName] ?? "💳"}
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <input
            type="date"
            value={dateRangeStart}
            onChange={(e) => {
              setDateRangeStart(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={dateRangeEnd}
            onChange={(e) => {
              setDateRangeEnd(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Clear */}
        {(searchQuery ||
          filterType !== "all" ||
          filterCategory !== "all" ||
          dateRangeStart ||
          dateRangeEnd) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setFilterCategory("all");
                setDateRangeStart("");
                setDateRangeEnd("");
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <TransactionTable
        paginatedTransactions={paginatedTransactions}
        filteredTransactions={filteredTransactions}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        handleDelete={handleDelete}
        formatCurrency={formatCurrency}
      />

      {/* Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSubmit={handleAddTransaction}
        initialType={transactionType}
      />
    </div>
  );
};

export default TransactionHome;
