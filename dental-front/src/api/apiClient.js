import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
  withCredentials: true // Для отправки кук/токенов
});

// Добавьте обработку 401 ошибки
// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       // Перенаправление на страницу логина или обновление токена
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;