import fetchBackendApi from "@/config/backendApi";
import { CreateBudgetData } from "@/interfaces/budget";

export const getMyBudget = async () => {
  return fetchBackendApi(`budget`, {
    method: "GET",
  });
};

export const createBudget = async (data: CreateBudgetData) => {
    return fetchBackendApi(`budget`, {
      method: "POST",
      body: JSON.stringify(data),
    });
}