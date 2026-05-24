"use client";

import { useState } from "react";

import { Category } from "@/interfaces/category";
import { Transaction } from "@/interfaces/transaction";

import { MOCK_CATEGORIES, MOCK_TRANSACTIONS } from "@/data/mock";
import CategoryTabsGrid from "./CategoryTabsGrid";
import AddCategoryModal from "./AddCategoryModal";
import CategoriesHeader from "./CategoryHeader";
import CategoryCard from "./CategoryCard";

const CategoryComponent: React.FC = () => {
  const [categories, setCategories] =
    useState<Category[]>(MOCK_CATEGORIES);

  const [transactions] =
    useState<Transaction[]>(MOCK_TRANSACTIONS);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [activeTab, setActiveTab] = useState<
    "all" | "income" | "expense"
  >("all");

  const [form, setForm] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    color: "#3B82F6",
    icon: "📦",
  });

  const colorOptions = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F97316",
    "#14B8A6",
  ];

  const iconOptions = [
    "💰",
    "💼",
    "🍔",
    "🚗",
    "🛍️",
    "📄",
    "🏠",
    "💊",
    "🎮",
    "✈️",
    "📱",
    "👕",
    "🎬",
    "📚",
    "☕",
    "🎵",
  ];

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

    const newCategory: Category = {
      categoryId:
        editingCategory?.categoryId ||
        Date.now().toString(),

      categoryName: form.name,

      type: form.type,

      color: form.color,

      icon: form.icon,

      isCustom: true,
    };

    if (editingCategory) {
      setCategories(
        categories.map((category) =>
          category.categoryId === editingCategory.categoryId
            ? newCategory
            : category,
        ),
      );
    } else {
      setCategories([
        ...categories,
        newCategory,
      ]);
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
      color: category.color,
      icon: category.icon,
    });

    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const category = categories.find(
      (c) => c.categoryId === id,
    );

    const isInUse = transactions.some(
      (t) => t.category === category?.categoryName,
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

    setCategories(
      categories.filter(
        (category) => category.categoryId !== id,
      ),
    );
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
        colorOptions={colorOptions}
        iconOptions={iconOptions}
      />
    </div>
  );
};

export default CategoryComponent;