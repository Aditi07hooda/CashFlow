import React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
} from "lucide-react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CategoryColorsAvailable, NewCategoryIconsAvailable } from "@/data/categoryIcons";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;

  editingCategory: boolean;

  form: {
    name: string;
    type: "income" | "expense";
    color: string;
    icon: string;
  };

  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: "income" | "expense";
      color: string;
      icon: string;
    }>
  >;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  form,
  setForm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingCategory
          ? "Edit Category"
          : "Add New Category"
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Category Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          placeholder="e.g. Salary, Food"
          required
        />

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  type: "expense",
                })
              }
              className={`py-3 rounded-lg font-medium border-2 transition-all ${
                form.type === "expense"
                  ? "bg-red-50 border-red-500 text-red-700"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              <ArrowDownRight
                className="inline mr-2"
                size={18}
              />
              Expense
            </button>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  type: "income",
                })
              }
              className={`py-3 rounded-lg font-medium border-2 transition-all ${
                form.type === "income"
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              <ArrowUpRight
                className="inline mr-2"
                size={18}
              />
              Income
            </button>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color *
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {CategoryColorsAvailable.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    color,
                  })
                }
                className={`w-full aspect-square rounded-lg ${
                  form.color === color
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }`}
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        </div>

        {/* Icons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Icon *
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {NewCategoryIconsAvailable.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    icon,
                  })
                }
                className={`w-full aspect-square rounded-lg flex items-center justify-center text-2xl ${
                  form.icon === icon
                    ? "bg-blue-100 ring-2 ring-blue-500"
                    : "bg-gray-100"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-2">
            Preview
          </p>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{
                backgroundColor: form.color + "20",
              }}
            >
              {form.icon}
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {form.name || "Category Name"}
              </p>

              <p className="text-sm text-gray-600">
                {form.type}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button type="submit" className="flex-1">
            <Check size={20} />

            {editingCategory
              ? "Update"
              : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;