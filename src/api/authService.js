import apiClient from "./apiClient";

const login = async (email, password) => {
  console.log("Login request:", { email, password });
  const response = await apiClient.post("/auth/login", { email, password });
  console.log("Login response headers:", response.headers); // Проверяем заголовки
  console.log("Login response data:", response.data);
  return response.data;
};

const register = async (userData) => {
  console.log("Register request:", userData);
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

const logout = async () => {
  console.log("Logout: Sending POST request to /api/auth/logout");
  const response = await apiClient.post("/auth/logout");
  console.log("Logout: Response received:", response);
  return response.data;
};

export default { login, register, logout };