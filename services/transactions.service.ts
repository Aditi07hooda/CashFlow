import fetchBackendApi from "@/config/backendApi";
import { TransactionFormData } from "@/interfaces/transaction";

export const getMyTransactions = async (minDate: string, maxDate: string) => {
  return fetchBackendApi(`mytransactions?minDateControl=${minDate}&maxDateControl=${maxDate}`, {
    method: "GET",
  });
};

export const getTotalIncome = async (minDate: string, maxDate: string) => {
  return fetchBackendApi(`income/total?minDateControl=${minDate}&maxDateControl=${maxDate}`, {
    method: "GET",
  });
};

export const getTotalSpent = async (minDate: string, maxDate: string) => {
  return fetchBackendApi(`spent/total?minDateControl=${minDate}&maxDateControl=${maxDate}`, {
    method: "GET",
  });
};

export const createTransaction = async (data: TransactionFormData) => {
  return fetchBackendApi("transaction", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTransaction = async (id: number, data: {
  amount?: number;
  category?: string;
  description?: string;
}) => {
  return fetchBackendApi(`transaction/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteTransaction = async (id: number) => {
  return fetchBackendApi(`transaction/${id}`, { method: "DELETE" });
};