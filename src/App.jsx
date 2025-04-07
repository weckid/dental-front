import {Header} from "./components/Header/Header"
import { MainContent } from "./components/Main/MainContent/MainContent";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Footer } from "./components/Footer/Footer"
import About from "./components/Main/About/About";
import { Contacts } from "./components/Main/Contacts/Contacts"
import { Entry } from "./components/Main/Entry/Entry"
import { Catalog } from "./components/Main/Catalog/Catalog"
import { Login } from "./components/Main/Login/Login"
import axios from "axios";
import { StoreContext } from './stores/storeContext';
import { rootStore } from './stores/rootStore';
import Profile from './components/Main/Profile/Profile';
import  AdminPanel  from "./components/Main/AdminPanel/AdminPanel"

function App() {
// Настройка базового URL
axios.defaults.baseURL = 'http://localhost:8080';

// Добавление интерцептора для JWT
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const ProtectedRoute = ({ children }) => {
  const { authStore } = rootStore;
  console.log("ProtectedRoute: isAuth =", authStore.isAuth);
  return authStore.isAuth ? children : <Navigate to="/Login" />;
};
   return (
    <StoreContext.Provider value={rootStore}>
      <Header/>
      <Routes>
        <Route path="/MainContent" element={<MainContent/>}></Route>
        <Route path="/About" element={<About/>}/>
        <Route path="/Contacts" element={<Contacts/>}></Route>
        <Route path="/Entry" element={<Entry/>}></Route>
        <Route path="/Catalog" element={<Catalog/>}></Route>
        <Route path="/Login" element={<Login/>}></Route>
        <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ROLE_ADMIN"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer/>
    </StoreContext.Provider>
  );
}
 
export default App;