export const TOKEN_LS_KEY = "token";

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_LS_KEY);

  return token;
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_LS_KEY, token);
};
