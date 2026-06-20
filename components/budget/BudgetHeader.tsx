"use client";

import { JSX } from "react";

import { Plus } from "lucide-react";

import Button from "../ui/Button";

interface BudgetHeaderProps {
  onAddBudget: () => void;

  selectedMonth: string;

  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
}

const BudgetHeader = ({
  onAddBudget,
  selectedMonth,
  setSelectedMonth,
}: BudgetHeaderProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Budget & Limits
        </h1>

        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Set spending limits and track your budget
        </p>
      </div>

      {/* Right */}
      <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:w-auto"
        />

        <Button
          onClick={onAddBudget}
          className="w-full sm:w-auto"
        >
          <Plus size={18} />

          <span>Set Budget</span>
        </Button>
      </div>
    </div>
  );
};

export default BudgetHeader;