import React from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";

interface CategoriesHeaderProps {
  onAddCategory: () => void;
}

const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({
  onAddCategory,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Categories
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Organize your transactions with custom categories
        </p>
      </div>

      <Button
        onClick={onAddCategory}
        className="w-full sm:w-auto"
      >
        <Plus size={20} />

        <span className="hidden sm:inline">
          Add Category
        </span>

        <span className="sm:hidden">
          Add
        </span>
      </Button>
    </div>
  );
};

export default CategoriesHeader;