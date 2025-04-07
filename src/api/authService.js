import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  withCredentials: true, // Для работы с cookies
});

const login = async (email, password) => {
  console.log("Login request:", { email, password });
  const response = await api.post("/login", { email, password });
  return response.data;
};

const register = async (userData) => {
  console.log("Register request:", userData);
  const response = await api.post("/register", userData);
  return response.data; 
};

const logout = async () => {
  console.log("Logout: Sending POST request to /api/auth/logout");
  const response = await api.post("/logout");
  console.log("Logout: Response received:", response);
  return response.data;
};

export default {
  login,
  register,
  logout,
};