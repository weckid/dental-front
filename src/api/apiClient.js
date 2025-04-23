import axios from "axios";
import { rootStore } from "../stores/rootStore";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  withCredentials: true,
});

// Обработка 401 (Unauthorized)
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log("Токен истёк или недействителен, перенаправление на /login");
//       rootStore.authStore.logout();
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

apiClient.interceptors.request.use((config) => {
  const token = rootStore.authStore.token || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Добавлен токен в запрос:", token.substring(0, 20) + "...");
  } else {
    console.log("Токен отсутствует");
  }
  return config;
});

export default apiClient;