export const getCookie = (headers) => {
  const setCookie = headers["set-cookie"];

  if (!setCookie) {
    throw new Error("No set-cookie header found");
  }

  const cookieParts = setCookie.split("; ");

  const jwtToken = cookieParts
    .find((part) => part.startsWith("jwt_token="))
    ?.split("=")[1];

  const expiryDate = cookieParts
    .find((part) => part.startsWith("Expires="))
    ?.split("=")[1];

  return { jwtToken, expiryDate };
};
