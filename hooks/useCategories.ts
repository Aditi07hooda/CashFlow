import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";
import { Category } from "@/interfaces/category";

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,

    // categories rarely change
    staleTime: Infinity,
    gcTime: Infinity,

    // optional
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};