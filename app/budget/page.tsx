"use client";
import { Category } from "@/interfaces/category";
import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Target,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { MOCK_CATEGORIES, MOCK_TRANSACTIONS, MOCK_BUDGETS } from "@/data/mock";
import { Transaction } from "@/interfaces/transaction";
import { Budget } from "@/interfaces/budget";
import Select from "@/components/ui/Select";

const BudgetPage: React.FC = () => {
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [form, setForm] = useState({
    categoryId: "",
    limit: "",
    month: new Date().toISOString().slice(0, 7),
  });

  const expenseCategories = categories.filter((c) => c.type === "expense");

  const calculateSpent = (categoryName: string, month: string) => {
    return transactions
      .filter(
        (t) =>
          t.category === categoryName &&
          t.type === "expense" &&
          t.date.startsWith(month),
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const currentBudgets = budgets
    .filter((b) => b.month === form.month)
    .map((b) => ({
      ...b,
      spent: calculateSpent(b.categoryName, b.month),
    }));

  const resetForm = () => {
    setForm({
      categoryId: "",
      limit: "",
      month: new Date().toISOString().slice(0, 7),
    });
    setEditingBudget(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = categories.find((c) => c.id === form.categoryId);
    if (!category) return;

    const newBudget: Budget = {
      id: editingBudget?.id || Date.now().toString(),
      categoryId: form.categoryId,
      categoryName: category.name,
      limit: parseFloat(form.limit),
      spent: calculateSpent(category.name, form.month),
      month: form.month,
    };

    if (editingBudget) {
      setBudgets(
        budgets.map((b) => (b.id === editingBudget.id ? newBudget : b)),
      );
    } else {
      setBudgets([...budgets, newBudget]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setForm({
      categoryId: budget.categoryId,
      limit: budget.limit.toString(),
      month: budget.month,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      setBudgets(budgets.filter((b) => b.id !== id));
    }
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-amber-500";
    return "bg-green-500";
  };

  const getStatusIcon = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100)
      return <AlertCircle className="text-red-500" size={18} />;
    if (percentage >= 80)
      return <AlertCircle className="text-amber-500" size={18} />;
    return <Check className="text-green-500" size={18} />;
  };

  return (
    <div className="space-y-6 px-4 lg:px-8 overflow-x-hidden">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Budget & Limits
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Set spending limits and track your budget
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="month"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} />
            Set Budget
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-100">Total Budget</span>
            <Target size={22} />
          </div>
          <p className="text-2xl sm:text-3xl font-bold break-words">
            ₹{currentBudgets.reduce((sum, b) => sum + b.limit, 0).toLocaleString()}
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-100">Total Spent</span>
            <TrendingDown size={22} />
          </div>
          <p className="text-2xl sm:text-3xl font-bold break-words">
            ₹{currentBudgets.reduce((sum, b) => sum + b.spent, 0).toLocaleString()}
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-100">Remaining</span>
            <DollarSign size={22} />
          </div>
          <p className="text-2xl sm:text-3xl font-bold break-words">
            ₹{currentBudgets
              .reduce((sum, b) => sum + (b.limit - b.spent), 0)
              .toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Budget List */}
      <Card className="p-4">
        {currentBudgets.length > 0 ? (
          <div className="space-y-4">
            {currentBudgets.map((budget) => {
              const category = categories.find(
                (c) => c.id === budget.categoryId,
              );
              const percentage = (budget.spent / budget.limit) * 100;
              const remaining = budget.limit - budget.spent;

              return (
                <div key={budget.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">

                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: category?.color + "20" }}
                      >
                        {category?.icon}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                          {budget.categoryName}
                          {getStatusIcon(budget.spent, budget.limit)}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                          ₹{budget.spent.toLocaleString()} of ₹
                          {budget.limit.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span
                        className={
                          remaining >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {remaining >= 0
                          ? `₹${remaining.toLocaleString()} left`
                          : `₹${Math.abs(remaining).toLocaleString()} over`}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${getProgressColor(
                          budget.spent,
                          budget.limit,
                        )}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Target size={40} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No budgets set</p>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingBudget ? "Edit Budget" : "Set Budget"}
      >
        <form onSubmit={handleSubmit}>
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            options={expenseCategories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            required
          />

          <Input
            label="Budget Limit"
            type="number"
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            required
          />

          <Input
            label="Month"
            type="month"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            required
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button type="submit" className="flex-1">
              <Check size={18} />
              {editingBudget ? "Update" : "Set"} Budget
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BudgetPage;