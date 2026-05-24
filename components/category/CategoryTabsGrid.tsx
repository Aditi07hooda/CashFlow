import React from "react";
import {
  Edit2,
  Tag,
  Trash2,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Category } from "@/interfaces/category";
import { Transaction } from "@/interfaces/transaction";

interface Props {
  categories: Category[];
  transactions: Transaction[];

  activeTab: "all" | "income" | "expense";
  setActiveTab: (
    tab: "all" | "income" | "expense",
  ) => void;

  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryTabsGrid: React.FC<Props> = ({
  categories,
  transactions,
  activeTab,
  setActiveTab,
  onEdit,
  onDelete,
}) => {
  const filteredCategories = categories.filter((c) => {
    if (activeTab === "all") return true;

    return c.type === activeTab;
  });

  const incomeCount = categories.filter(
    (c) => c.type === "income",
  ).length;

  const expenseCount = categories.filter(
    (c) => c.type === "expense",
  ).length;

  return (
    <Card className="p-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 min-w-25 px-4 py-3 text-sm font-medium ${
            activeTab === "all"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          All ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab("income")}
          className={`flex-1 min-w-25 px-4 py-3 text-sm font-medium ${
            activeTab === "income"
              ? "text-green-600 border-b-2 border-green-600 bg-green-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Income ({incomeCount})
        </button>

        <button
          onClick={() => setActiveTab("expense")}
          className={`flex-1 min-w-25 px-4 py-3 text-sm font-medium ${
            activeTab === "expense"
              ? "text-red-600 border-b-2 border-red-600 bg-red-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Expense ({expenseCount})
        </button>
      </div>

      {/* Grid */}
      <div className="p-4 sm:p-6">
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((cat) => {
              const usageCount = transactions.filter(
                (t) => t.category === cat.categoryName,
              ).length;

              return (
                <div
                  key={cat.categoryId}
                  className="group relative bg-white rounded-xl border-2 hover:shadow-lg transition-all overflow-hidden"
                  style={{
                    borderColor: cat.color + "30",
                  }}
                >
                  <div
                    className="h-1.5"
                    style={{
                      backgroundColor: cat.color,
                    }}
                  />

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                        style={{
                          backgroundColor:
                            cat.color + "15",
                        }}
                      >
                        {cat.icon}
                      </div>

                      {cat.isCustom && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              onEdit(cat)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            onClick={() =>
                              onDelete(cat.categoryId)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900">
                      {cat.categoryName}
                    </h3>

                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-gray-600">
                        {cat.type}
                      </span>

                      <span className="text-gray-500">
                        {usageCount} txns
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Tag
              size={48}
              className="mx-auto mb-3 opacity-30"
            />

            <p className="text-lg font-medium">
              No categories found
            </p>

            <p className="text-sm mt-1">
              Create your first category
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CategoryTabsGrid;