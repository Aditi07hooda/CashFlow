const fetchBackendApi = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND}/${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers,
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    const data = await response.json();
    throw new Error(data.message || "Something went wrong");
  }

  return response.json();
};

export default fetchBackendApi;
