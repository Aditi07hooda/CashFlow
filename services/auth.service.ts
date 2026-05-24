import fetchBackendApi from "@/config/backendApi";

export const login = async (data: {email: string, password: string}) => {
  return fetchBackendApi("login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const register = async (data: {username: string, email: string, password: string}) => {
  return fetchBackendApi("register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export const getMe = async () => {
  const res = fetchBackendApi(
    `myInfo`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res) {
    return null;
  }
  
  return res;
};