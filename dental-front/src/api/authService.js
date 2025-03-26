import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/'; 

const register = async (name, email, password) => {
  return axios.post(API_URL + 'register', {
    username: name,
    email,
    password
  });
};

const login = async (email, password) => {
  const response = await axios.post(API_URL + 'login', {
    email, // или username, в зависимости от бекенда
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout
};