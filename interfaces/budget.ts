export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  limit: number;
  spent: number;
  month: string;
}