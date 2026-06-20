"use client";

import React, { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Loader, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/interfaces/category";
import { CATEGORY_ICONS } from "@/data/categoryIcons";
import { TransactionFormData } from "@/interfaces/transaction";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: TransactionFormData) => Promise<void> | void;
  initialType?: "income" | "expense";
}

const PAYMENT_METHODS = [
  "Cash",
  "UPI",
  "Card",
];

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialType = "expense",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formType, setFormType] = useState<"income" | "expense">(initialType);
  const [formCategory, setFormCategory] = useState("");
  const [formDate, setFormDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [formPaymentMethod, setFormPaymentMethod] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    setFormType(initialType);
  }, [initialType]);

  const resetForm = () => {
    setFormAmount("");
    setFormCategory("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormPaymentMethod("");
    setFormDescription("");
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
    if (!formAmount || !formCategory || !formPaymentMethod) return;

    try {
      setLoading(true);
      setError("");

      await onSubmit({
        amount: Number(formAmount),
        transactionType: formType,
        category: formCategory,
        transactionDate: formatDateForBackend(formDate),
        accountType: formPaymentMethod,
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

  const availableCategories = categories.filter(
    (cat: Category) => cat.type === formType,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {formType === "income" ? "Add Income" : "Add Expense"}
          </h2>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Type Indicator */}
          <div
            className={`p-4 rounded-xl text-center ${
              formType === "income"
                ? "bg-green-50 border-2 border-green-200"
                : "bg-red-50 border-2 border-red-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              {formType === "income" ? (
                <ArrowDownRight size={24} className="text-green-600" />
              ) : (
                <ArrowUpRight size={24} className="text-red-600" />
              )}

              <span
                className={`text-lg font-bold ${
                  formType === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {formType === "income"
                  ? "Income Transaction"
                  : "Expense Transaction"}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                ₹
              </span>

              <input
                type="number"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select category</option>

              {availableCategories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryName}>
                  {CATEGORY_ICONS[cat.categoryName] ?? "💳"} {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Date + Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            />

            <select
              value={formPaymentMethod}
              onChange={(e) => setFormPaymentMethod(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">Payment Method</option>

              {PAYMENT_METHODS.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <textarea
            rows={3}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 px-6 py-3 text-white rounded-lg flex items-center justify-center gap-2 ${
                formType === "income"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  {formType === "income" ? "Add Income" : "Add Expense"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
