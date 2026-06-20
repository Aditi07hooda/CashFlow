import { createBudget, getMyBudget } from "@/services/budget.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBudget = () => {
  const queryClient = useQueryClient();

  const myBudget = useQuery({
    queryKey: ["budget"],
    queryFn: () => getMyBudget(),
    staleTime: 1000 * 60 * 5,
  });

  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      // refetch all related data

      queryClient.invalidateQueries({
        queryKey: ["budget"],
      });
    },
  });

  return {
    budgets: myBudget.data || [],
    isLoading: myBudget.isLoading,
    isError: myBudget.isError,
    createBudget: createBudgetMutation.mutateAsync,
    isCreating: createBudgetMutation.isPending,
  };
};
