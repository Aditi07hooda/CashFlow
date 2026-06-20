"use client";

import { JSX } from "react";
import { Edit2, Target, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import { BudgetResponse } from "@/interfaces/budget";
import { CATEGORY_ICONS } from "@/data/categoryIcons";
import { Category } from "@/interfaces/transaction";

interface BudgetListProps {
  currentBudgets: BudgetResponse[];

  categories: Category[];

  onEdit: (budget: BudgetResponse) => void;

  onDelete: (id: number) => void;

  getStatusIcon: (
    spent: number,
    amount: number,
  ) => JSX.Element;

  getProgressColor: (
    spent: number,
    amount: number,
  ) => "bg-red-500" | "bg-amber-500" | "bg-green-500";
}

const BudgetList = ({
  currentBudgets,
  categories,
  onEdit,
  onDelete,
  getStatusIcon,
  getProgressColor,
}: BudgetListProps) => {
  return (
    <Card className="p-4">
      {currentBudgets.length > 0 ? (
        <div className="space-y-4">
          {currentBudgets.map((budget) => {
            const amount = budget.budget || 0;

            const spent = budget.spent || 0;

            const percentage =
              amount > 0 ? (spent / amount) * 100 : 0;

            const remaining = amount - spent;

            return (
              <div
                key={budget.id}
                className="rounded-xl bg-gray-50 p-4"
              >
                {/* Top */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left */}
                  <div className="flex gap-3">
                    {/* Category Icons */}
                    <div className="flex -space-x-2">
                      {budget.categories
                        ?.slice(0, 3)
                        .map((category) => {
                          const matchedCategory =
                            categories.find(
                              (c) =>
                                c.categoryName ===
                                category.categoryName,
                            );

                          return (
                            <div
                              key={category.categoryId}
                              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-lg shadow-sm"
                            >
                              {CATEGORY_ICONS[
                                category.categoryName
                              ] ?? "💳"}
                            </div>
                          );
                        })}
                    </div>

                    {/* Budget Info */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 sm:text-base">
                        {budget.description ||
                          "Budget Plan"}

                        {getStatusIcon(
                          spent,
                          amount,
                        )}
                      </h3>

                      <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                        ₹{spent.toLocaleString()} of ₹
                        {amount.toLocaleString()}
                      </p>

                      {/* Categories */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {budget.categories?.map(
                          (category) => (
                            <span
                              key={category.categoryId}
                              className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
                            >
                              {category.categoryName}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => onEdit(budget)}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(budget.id)
                      }
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>
                      {percentage.toFixed(1)}% used
                    </span>

                    <span
                      className={
                        remaining >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {remaining >= 0
                        ? `₹${remaining.toLocaleString()} left`
                        : `₹${Math.abs(
                            remaining,
                          ).toLocaleString()} over`}
                    </span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2.5 rounded-full transition-all ${getProgressColor(
                        spent,
                        amount,
                      )}`}
                      style={{
                        width: `${Math.min(
                          percentage,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {budget.startDate} →{" "}
                    {budget.endDate}
                  </span>

                  <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">
                    {budget.period}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          <Target
            size={40}
            className="mx-auto mb-3 opacity-50"
          />

          <p className="font-medium">
            No budgets set
          </p>

          <p className="mt-1 text-sm">
            Create your first budget plan
          </p>
        </div>
      )}
    </Card>
  );
};

export default BudgetList;