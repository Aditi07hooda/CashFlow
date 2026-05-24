import { ArrowDownRight, ArrowUpRight, Tag } from "lucide-react";
import Card from "../ui/Card";
import { Category } from "@/interfaces/category";

interface CategoryCardProps {
  incomeCount: number;
  expenseCount: number;
  categories: Category[];
}

const CategoryCard = ({
  incomeCount,
  expenseCount,
  categories,
}: CategoryCardProps) => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Categories</p>
              <p className="text-3xl font-bold mt-1">{categories.length}</p>
            </div>
            <Tag size={32} className="text-blue-200 opacity-80" />
          </div>
        </Card>
        <Card className="bg-linear-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Income</p>
              <p className="text-3xl font-bold mt-1">{incomeCount}</p>
            </div>
            <ArrowUpRight size={32} className="text-green-200 opacity-80" />
          </div>
        </Card>
        <Card className="bg-linear-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Expense</p>
              <p className="text-3xl font-bold mt-1">{expenseCount}</p>
            </div>
            <ArrowDownRight size={32} className="text-red-200 opacity-80" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default CategoryCard;
