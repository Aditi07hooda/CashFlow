"use client";

import {
  DollarSign,
  Target,
  TrendingDown,
} from "lucide-react";

import Card from "../ui/Card";

interface BudgetCardProps {
  currentBudgets: Array<{
    budget: number;
    spent: number;
  }>;
}

const BudgetCard = ({
  currentBudgets,
}: BudgetCardProps) => {
  const totalBudget = currentBudgets.reduce(
    (sum, budget) => sum + (budget.budget || 0),
    0,
  );

  const totalSpent = currentBudgets.reduce(
    (sum, budget) => sum + (budget.spent || 0),
    0,
  );

  const remaining = totalBudget - totalSpent;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Budget */}
      <Card className="bg-linear-to-br from-blue-500 to-blue-600 p-4 text-white">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-blue-100">
            Total Budget
          </span>

          <Target size={22} />
        </div>

        <p className="text-2xl font-bold sm:text-3xl">
          ₹{totalBudget.toLocaleString()}
        </p>
      </Card>

      {/* Total Spent */}
      <Card className="bg-linear-to-br from-red-500 to-red-600 p-4 text-white">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-red-100">
            Total Spent
          </span>

          <TrendingDown size={22} />
        </div>

        <p className="text-2xl font-bold sm:text-3xl">
          ₹{totalSpent.toLocaleString()}
        </p>
      </Card>

      {/* Remaining */}
      <Card className="bg-linear-to-br from-green-500 to-green-600 p-4 text-white">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-green-100">
            Remaining
          </span>

          <DollarSign size={22} />
        </div>

        <p className="text-2xl font-bold sm:text-3xl">
          ₹{remaining.toLocaleString()}
        </p>
      </Card>
    </div>
  );
};

export default BudgetCard;