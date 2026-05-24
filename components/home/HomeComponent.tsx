"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import {
  ArrowUpRight,
  Calendar,
  Camera,
  Eye,
  EyeOff,
  PieChart,
  Plus,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { TransactionFormData, TransactionFromAPI } from "@/interfaces/transaction";
import TransactionModal from "@/components/transactions/TransactionModal";
import { CATEGORY_ICONS } from "@/data/categoryIcons";

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    Food: "🛒",
    Groceries: "🛒",
    Transport: "🚌",
    Entertainment: "📺",
    Shopping: "🛍️",
    Salary: "💰",
    Freelance: "💻",
    Utilities: "💡",
  };
  return icons[category] ?? "💳";
};

const HomeComponent: React.FC = () => {
  const [hideBalance, setHideBalance] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const { user } = useAuth();
  const { transactions, totalIncome, totalSpent, createTransaction, isLoading } = useTransactions();

  const formatCurrency = (amount: number) =>
    hideBalance
      ? "₹ •••••"
      : `₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Derived stats from transactions
  const totalBalance = totalIncome - totalSpent;
  const upcomingBills = transactions
    .filter(
      (t: TransactionFromAPI) =>
        t.transactionType === "EXPENSE" && new Date(t.transactionDate) > new Date(),
    )
    .reduce((sum: number, t: TransactionFromAPI) => sum + t.amount, 0);

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`).getTime();
  };

  const recentTransactions = [...transactions]
    .sort(
      (a: TransactionFromAPI, b: TransactionFromAPI) =>
        parseDate(b.transactionDate) - parseDate(a.transactionDate),
    )
    .slice(0, 5);

  const quickStats = [
    {
      label: "Total Spent",
      value: totalSpent,
      type: "expense",
      icon: TrendingDown,
    },
    {
      label: "Total Income",
      value: totalIncome,
      type: "income",
      icon: ArrowUpRight,
    },
    {
      label: "Bills Due",
      value: upcomingBills,
      type: "expense",
      icon: Calendar,
    },
    {
      label: "Net Balance",
      value: totalBalance,
      type: "income",
      icon: PieChart,
    },
  ];

  const firstName = user?.username ?? "there";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const openIncomeModal = () => {
    setTransactionType("income");
    setIsTransactionModalOpen(true);
  };

  const openExpenseModal = () => {
    setTransactionType("expense");
    setIsTransactionModalOpen(true);
  };

  const handleAddTransaction = async (transaction: TransactionFormData) => {
    console.log(transaction);
    await createTransaction(transaction);
    setIsTransactionModalOpen(false);
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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            {getGreeting()}, {firstName}! 👋
          </h1>
          <button
            onClick={() => setHideBalance(!hideBalance)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {hideBalance ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening with your finances today
        </p>
      </div>

      {/* Total Balance Card */}
      <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-blue-100 text-sm mb-2">Net Balance</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1">
              {formatCurrency(totalBalance)}
            </h2>
            <p className="text-blue-100 text-sm">
              {new Date().getFullYear()} overview
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Wallet size={32} />
          </div>
        </div>
        <div className="flex gap-4 pt-4 border-t border-white/20">
          <div className="flex-1">
            <p className="text-blue-100 text-xs mb-1">This Year Income</p>
            <p className="text-lg font-semibold">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-blue-100 text-xs mb-1">This Year Spent</p>
            <p className="text-lg font-semibold">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-2.5 rounded-lg ${stat.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                  >
                    <Icon
                      size={20}
                      className={
                        stat.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(stat.value)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={openIncomeModal} className="flex items-center justify-center gap-3 bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <Plus size={24} />
            <span>Add Income</span>
          </button>
          <button onClick={openExpenseModal} className="flex items-center justify-center gap-3 bg-linear-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <Plus size={24} />
            <span>Add Expense</span>
          </button>
          <button className="flex items-center justify-center gap-3 bg-linear-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <Camera size={24} />
            <span>Scan Receipt</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No transactions yet
            </div>
          ) : (
            recentTransactions.map((activity: TransactionFromAPI) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      {CATEGORY_ICONS[activity.category.categoryName] ?? "💳"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {activity.note ?? activity.category.categoryName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.category.categoryName}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {activity.transactionDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-bold ${activity.transactionType === "INCOME" ? "text-green-600" : "text-red-600"}`}
                  >
                    {activity.transactionType === "INCOME" ? "+" : "-"}
                    {formatCurrency(activity.amount)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSubmit={handleAddTransaction}
        initialType={transactionType}
      />
    </div>
  );
};

export default HomeComponent;
