"use client";

import React, { useEffect, useState } from "react";
import { Check, Loader, Wallet, X } from "lucide-react";

import { Budget, BUDGET_PERIOD, BudgetResponse, CreateBudgetData } from "@/interfaces/budget";

import { Category } from "@/interfaces/category";
import { CATEGORY_ICONS } from "@/data/categoryIcons";

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;

  onSubmit: (budget: CreateBudgetData) => Promise<void> | void;

  categories: Category[];
  editingBudget?: BudgetResponse | null;
}

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  editingBudget = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formAmount, setFormAmount] = useState("");

  const [formStartDate, setFormStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [formBudgetPeriod, setFormBudgetPeriod] = useState<BUDGET_PERIOD>(
    BUDGET_PERIOD.MONTHLY,
  );

  const [formCategories, setFormCategories] = useState<string[]>([]);

  const [formDescription, setFormDescription] = useState("");

  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const addDays = (date: Date, days: number) => {
    const newDate = new Date(date);

    newDate.setDate(newDate.getDate() + days);

    return newDate;
  };

  const addMonths = (date: Date, months: number) => {
    const newDate = new Date(date);

    newDate.setMonth(newDate.getMonth() + months);

    return newDate;
  };

  const getEndDateByPeriod = (startDate: string, period: BUDGET_PERIOD) => {
    const start = new Date(startDate);

    switch (period) {
      case BUDGET_PERIOD.DAILY:
        return formatDate(addDays(start, 1));

      case BUDGET_PERIOD.WEEKLY:
        return formatDate(addDays(start, 7));

      case BUDGET_PERIOD.MONTHLY:
        return formatDate(addMonths(start, 1));

      case BUDGET_PERIOD.CUSTOM:
        return formatDate(addDays(start, 1));

      default:
        return formatDate(addMonths(start, 1));
    }
  };

  const today = formatDate(new Date());

  const [formEndDate, setFormEndDate] = useState(
    getEndDateByPeriod(today, BUDGET_PERIOD.MONTHLY),
  );

  const resetForm = () => {
    setFormAmount("");

    setFormStartDate(new Date().toISOString().split("T")[0]);

    setFormEndDate(new Date().toISOString().split("T")[0]);

    setFormBudgetPeriod(BUDGET_PERIOD.MONTHLY);

    setFormCategories([]);

    setFormDescription("");

    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDateForBackend = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    if (
      !formAmount ||
      !formStartDate ||
      !formEndDate ||
      formCategories.length === 0
    ) {
      setError("Please fill all required fields");
      return;
    }

    const start = new Date(formStartDate);

    const end = new Date(formEndDate);

    if (end <= start) {
      setError("End date must be after start date");

      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSubmit({
        amount: Number(formAmount),
        startDate: formatDateForBackend(formStartDate),
        endDate: formatDateForBackend(formEndDate),
        budgetPeriod: formBudgetPeriod,
        categoryNames: formCategories,
        description: formDescription,
      });

      handleClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const getBudgetPeriodLabel = (period: BUDGET_PERIOD) => {
    switch (period) {
      case BUDGET_PERIOD.DAILY:
        return "Daily";

      case BUDGET_PERIOD.WEEKLY:
        return "Weekly";

      case BUDGET_PERIOD.MONTHLY:
        return "Monthly";

      case BUDGET_PERIOD.CUSTOM:
        return "Custom";

      default:
        return "Monthly";
    }
  };

  useEffect(() => {
    const newEndDate = getEndDateByPeriod(formStartDate, formBudgetPeriod);

    setFormEndDate(newEndDate);
  }, [formStartDate, formBudgetPeriod]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editingBudget ? "Edit Budget" : "Create Budget"}
          </h2>

          <button
            onClick={handleClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Banner */}
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <Wallet size={24} className="text-amber-600" />

              <span className="text-lg font-bold text-amber-700">
                Budget Planner
              </span>
            </div>

            <p className="text-sm text-amber-600">
              Track and control your spending smartly
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Budget Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>

              <input
                type="number"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4"
              />
            </div>
          </div>

          {/* Budget Period */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Budget Period
            </label>

            <select
              value={formBudgetPeriod}
              onChange={(e) =>
                setFormBudgetPeriod(e.target.value as BUDGET_PERIOD)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value={BUDGET_PERIOD.DAILY}>Daily</option>

              <option value={BUDGET_PERIOD.WEEKLY}>Weekly</option>

              <option value={BUDGET_PERIOD.MONTHLY}>Monthly</option>

              <option value={BUDGET_PERIOD.CUSTOM}>Custom</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date
              </label>

              <input
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date
              </label>

              <input
                type="date"
                value={formEndDate}
                min={
                  formBudgetPeriod === BUDGET_PERIOD.CUSTOM
                    ? formatDate(addDays(new Date(formStartDate), 1))
                    : formEndDate
                }
                onChange={(e) => {
                  if (formBudgetPeriod === BUDGET_PERIOD.CUSTOM) {
                    setFormEndDate(e.target.value);
                  }
                }}
                disabled={formBudgetPeriod !== BUDGET_PERIOD.CUSTOM}
                className={`w-full rounded-lg border border-gray-300 px-4 py-3 ${
                  formBudgetPeriod !== BUDGET_PERIOD.CUSTOM
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Categories
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {expenseCategories.map((cat) => {
                const isSelected = formCategories.includes(cat.categoryName);

                return (
                  <button
                    key={cat.categoryId}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setFormCategories((prev) =>
                          prev.filter((name) => name !== cat.categoryName),
                        );
                      } else {
                        setFormCategories((prev) => [
                          ...prev,
                          cat.categoryName,
                        ]);
                      }
                    }}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">
                      {CATEGORY_ICONS[cat.categoryName] ?? "💳"}
                    </span>

                    <span className="truncate">{cat.categoryName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Add budget description..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-3 text-xs font-medium text-gray-600">
              Budget Preview
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount</span>

                <span className="font-semibold text-gray-900">
                  ₹ {formAmount || "0"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Period</span>

                <span className="font-medium text-gray-900">
                  {getBudgetPeriodLabel(formBudgetPeriod)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Categories</span>

                <span className="font-medium text-gray-900">
                  {formCategories.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>

                <span className="font-medium text-gray-900">
                  {formStartDate} → {formEndDate}
                </span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <button
              onClick={handleClose}
              className="flex-1 rounded-lg border border-gray-300 px-6 py-3"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-white hover:bg-amber-700 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  {editingBudget ? "Update Budget" : "Create Budget"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetModal;
