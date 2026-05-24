import fetchBackendApi from "@/config/backendApi";

export const getCategories = async () => {
  return fetchBackendApi("category");
};