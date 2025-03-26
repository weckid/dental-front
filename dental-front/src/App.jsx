import {Header} from "./components/Header/Header"
import { MainContent } from "./components/Main/MainContent/MainContent";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer/Footer"
import About from "./components/Main/About/About";
import { Contacts } from "./components/Main/Contacts/Contacts"
import { Entry } from "./components/Main/Entry/Entry"
import { Catalog } from "./components/Main/Catalog/Catalog"
import { Login } from "./components/Main/Login/Login"
import axios from "axios";

function App() {
// Настройка базового URL
axios.defaults.baseURL = 'http://localhost:8080';

// Добавление интерцептора для JWT
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
   return (
    <>
      <Header/>
      <Routes>
        <Route path="/MainContent" element={<MainContent/>}></Route>
        <Route path="/About" element={<About/>}/>
        <Route path="/Contacts" element={<Contacts/>}></Route>
        <Route path="/Entry" element={<Entry/>}></Route>
        <Route path="/Catalog" element={<Catalog/>}></Route>
        <Route path="/Login" element={<Login/>}></Route>
      </Routes>
      <Footer/>
    </>
  );
}
 
export default App;