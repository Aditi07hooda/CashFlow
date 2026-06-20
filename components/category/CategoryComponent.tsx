"use client";

import { useState } from "react";
import { Category, TransactionFromAPI } from "@/interfaces/transaction";
import CategoryTabsGrid from "./CategoryTabsGrid";
import AddCategoryModal from "./AddCategoryModal";
import CategoriesHeader from "./CategoryHeader";
import CategoryCard from "./CategoryCard";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { CategoryFormData } from "@/interfaces/category";

const CategoryComponent: React.FC = () => {
  const { data: categories = [] } = useCategories();

  const { transactions = [] } = useTransactions();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<CategoryFormData | null>(null);

  const [activeTab, setActiveTab] = useState<
    "all" | "income" | "expense"
  >("all");

  const [form, setForm] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    color: "#3B82F6" || null,
    icon: "📦" || null,
  });

  const resetForm = () => {
    setForm({
      name: "",
      type: "expense",
      color: "#3B82F6",
      icon: "📦",
    });

    setEditingCategory(null);
  };

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const newCategory: CategoryFormData = {
      categoryId: editingCategory?.categoryId || Date.now().toString(),
      categoryName: form.name,
      type: form.type,
      color: form.color,
      icon: form.icon,
      isCustom: true,
    };

    if (editingCategory) {
      // api call
    } else {
      //api call
    }

    setIsModalOpen(false);

    resetForm();
  };

  const handleEdit = (
    category: Category,
  ) => {
    setEditingCategory(category);

    setForm({
      name: category.categoryName,
      type: category.type,
    });

    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const isInUse = transactions.some(
      (t: TransactionFromAPI) => t.category.categoryId === id,
    );

    if (isInUse) {
      alert(
        "Cannot delete category that has transactions.",
      );

      return;
    }

    const confirmed = confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    // api call
  };

  return (
    <div className="space-y-6 lg:px-8">
      {/* Header */}
      <CategoriesHeader
        onAddCategory={() => {
          resetForm();

          setIsModalOpen(true);
        }}
      />

      {/* Category Cards */}
      <CategoryCard
        incomeCount={categories.filter((c) => c.type === "income").length}
        expenseCount={categories.filter((c) => c.type === "expense").length}
        categories={categories}
      />

      {/* Tabs + Grid */}
      <CategoryTabsGrid
        categories={categories}
        transactions={transactions}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);

          resetForm();
        }}
        onSubmit={handleSubmit}
        editingCategory={!!editingCategory}
        form={form}
        setForm={setForm}
      />
    </div>
  );
};

export default CategoryComponent;