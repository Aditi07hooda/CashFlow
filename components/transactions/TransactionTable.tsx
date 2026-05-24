"use client";

import React from "react";

import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  TrendingUp,
} from "lucide-react";

import { TransactionFromAPI } from "@/interfaces/transaction";
import { CATEGORY_ICONS } from "@/data/categoryIcons";

interface TransactionTableProps {
  paginatedTransactions: TransactionFromAPI[];

  filteredTransactions: TransactionFromAPI[];

  currentPage: number;

  totalPages: number;

  itemsPerPage: number;

  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  handleDelete: (id: number) => void;

  formatCurrency: (amount: number) => string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  paginatedTransactions,
  filteredTransactions,
  currentPage,
  totalPages,
  itemsPerPage,
  setCurrentPage,
  handleDelete,
  formatCurrency,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Date
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Note
              </th>

              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                Amount
              </th>

              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(txn.transactionDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                        {CATEGORY_ICONS[txn.category.categoryName] ?? "💳"}
                      </div>

                      <span className="text-sm font-medium text-gray-900">
                        {txn.category.categoryName}
                      </span>
                    </div>
                  </td>

                  {/* Note */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {txn.note ?? "-"}
                  </td>

                  {/* Amount */}
                  <td
                    className={`px-6 py-4 text-right font-semibold whitespace-nowrap ${
                      txn.transactionType === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {txn.transactionType === "INCOME" ? "+" : "-"}
                    {formatCurrency(txn.amount)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(txn.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <TrendingUp
                      size={48}
                      className="mx-auto mb-3 opacity-30"
                    />

                    <p className="text-lg font-medium">
                      No transactions found
                    </p>

                    <p className="text-sm mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(
                startIndex + itemsPerPage,
                filteredTransactions.length,
              )}{" "}
              of {filteredTransactions.length} transactions
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="px-4 text-sm font-medium">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1),
                  )
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;