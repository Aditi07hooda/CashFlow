import {
  createTransaction,
  deleteTransaction,
  getMyTransactions,
  getTotalIncome,
  getTotalSpent,
} from "@/services/transactions.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getYearRange = () => {
  const year = new Date().getFullYear();

  return {
    minDate: `01/01/${year}`,
    maxDate: `31/12/${year}`,
  };
};

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const { minDate, maxDate } = getYearRange();

  // ================= QUERIES =================

  const transactionsQuery = useQuery({
    queryKey: ["transactions", minDate, maxDate],
    queryFn: () => getMyTransactions(minDate, maxDate),
    staleTime: 1000 * 60 * 5,
  });

  const incomeQuery = useQuery({
    queryKey: ["income-total", minDate, maxDate],
    queryFn: () => getTotalIncome(minDate, maxDate),
    staleTime: 1000 * 60 * 5,
  });

  const spentQuery = useQuery({
    queryKey: ["spent-total", minDate, maxDate],
    queryFn: () => getTotalSpent(minDate, maxDate),
    staleTime: 1000 * 60 * 5,
  });

  // ================= MUTATION =================

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,

    onSuccess: () => {
      // refetch all related data

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["income-total"],
      });

      queryClient.invalidateQueries({
        queryKey: ["spent-total"],
      });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["income-total"],
      });

      queryClient.invalidateQueries({
        queryKey: ["spent-total"],
      });
    },
  });

  return {
    // data
    transactions: transactionsQuery.data?.transactions ?? [],
    user: transactionsQuery.data?.user ?? null,
    totalIncome: incomeQuery.data ?? 0,
    totalSpent: spentQuery.data ?? 0,

    // loading
    isLoading:
      transactionsQuery.isLoading ||
      incomeQuery.isLoading ||
      spentQuery.isLoading,

    // mutation
    createTransaction: createTransactionMutation.mutateAsync,
    deleteTransaction: deleteTransactionMutation.mutateAsync,

    isCreatingTransaction: createTransactionMutation.isPending,
    isDeletingTransaction: deleteTransactionMutation.isPending,
  };
};
