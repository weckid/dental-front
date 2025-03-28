// api/authService.js
import axios from "axios";

const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data; // { token, username, message }
};

const register = async (userData) => {
  const response = await axios.post('/api/auth/register', userData);
  return response.data; // { token, username, message }
};

export default {
  login,
  register
};