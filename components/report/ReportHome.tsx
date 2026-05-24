"use client";
import {
  MOCK_CATEGORY_SPENDING,
  MOCK_MONTHLY_DATA,
  MOCK_TRANSACTIONS,
  topTransactions,
} from "@/data/mock";
import {
  TrendingUp,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  TrendingDown,
  DollarSign,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import React, { useState } from "react";

const ReportHome = () => {
  const [activePage, setActivePage] = useState("analytics");
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [selectedMonth, setSelectedMonth] = useState("February 2026");
  const [hideBalance, setHideBalance] = useState(false);

  const formatCurrency = (amount: number) => {
    return hideBalance ? "₹ •••••" : `₹ ${amount.toLocaleString("en-IN")}`;
  };

  const totalIncome =
    MOCK_MONTHLY_DATA[MOCK_MONTHLY_DATA.length - 1]?.income || 0;
  const totalExpense = MOCK_CATEGORY_SPENDING.reduce(
    (sum, cat) => sum + cat.amount,
    0,
  );
  const netSavings = totalIncome - totalExpense;
  const savingsRate = ((netSavings / totalIncome) * 100).toFixed(1);

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Analytics & Reports
            </h1>
            <p className="text-gray-600">
              Comprehensive insights into your financial health
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={hideBalance ? "Show balance" : "Hide balance"}
            >
              {hideBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <Download size={18} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200 w-fit">
            <button
              onClick={() => setPeriod("week")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === "week"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === "month"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === "year"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Year
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200 w-fit">
            <Calendar size={18} className="text-gray-500" />
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
              {selectedMonth}
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <ArrowUpRight size={24} />
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              +8.2%
            </span>
          </div>
          <p className="text-green-100 text-sm mb-1">Total Income</p>
          <p className="text-2xl sm:text-3xl font-bold">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <ArrowDownRight size={24} />
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              -3.5%
            </span>
          </div>
          <p className="text-red-100 text-sm mb-1">Total Expenses</p>
          <p className="text-2xl sm:text-3xl font-bold">
            {formatCurrency(totalExpense)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              +15.3%
            </span>
          </div>
          <p className="text-blue-100 text-sm mb-1">Net Savings</p>
          <p className="text-2xl sm:text-3xl font-bold">
            {formatCurrency(netSavings)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <PieChart size={24} />
            </div>
          </div>
          <p className="text-purple-100 text-sm mb-1">Savings Rate</p>
          <p className="text-2xl sm:text-3xl font-bold">{savingsRate}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Income vs Expense Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Income vs Expenses
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Details
            </button>
          </div>

          <div className="space-y-4">
            {MOCK_MONTHLY_DATA.map((data, index) => {
              const maxValue = Math.max(
                ...MOCK_MONTHLY_DATA.map((d) => Math.max(d.income, d.expense)),
              );
              const incomeWidth = (data.income / maxValue) * 100;
              const expenseWidth = (data.expense / maxValue) * 100;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {data.month}
                    </span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(data.income)}
                      </span>
                      <span className="text-red-600 font-semibold">
                        {formatCurrency(data.expense)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${incomeWidth}%` }}
                      />
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${expenseWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Spending by Category
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {MOCK_CATEGORY_SPENDING.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {category.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.percentage}% of total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(category.amount)}
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        category.change > 0
                          ? "text-red-600"
                          : category.change < 0
                            ? "text-green-600"
                            : "text-gray-500"
                      }`}
                    >
                      {category.change > 0 ? "+" : ""}
                      {category.change}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">
              Recent Transactions
            </h3>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                <Filter size={16} />
                Filter
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {topTransactions.map((txn) => (
            <div
              key={txn.id}
              className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: txn.color + "20" }}
                  >
                    {txn.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {txn.category}
                    </p>
                    <p className="text-sm text-gray-500">{txn.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(txn.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-lg font-bold ${
                    txn.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type === "income" ? "+" : "-"}
                  {formatCurrency(txn.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                Savings Goal Progress
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {
                  "You're on track to save ₹60,000 this month. Keep up the good work!"
                }
              </p>
              <div className="w-full bg-white rounded-full h-3 mb-2">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: "75%" }}
                />
              </div>
              <p className="text-xs text-gray-600">75% completed</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-600 rounded-xl">
              <TrendingDown size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Budget Alert</h4>
              <p className="text-sm text-gray-600 mb-4">
                You&apos;ve spent 80% of your food budget. Consider adjusting
                your spending.
              </p>
              <div className="w-full bg-white rounded-full h-3 mb-2">
                <div
                  className="bg-amber-600 h-3 rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
              <p className="text-xs text-gray-600">₹20,000 of ₹25,000</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportHome;
