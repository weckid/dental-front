import { Header } from "./components/Header/Header";
import { MainContent } from "./components/Main/MainContent/MainContent";
import { Routes, Route, Navigate } from "react-router-dom"; // Убираем BrowserRouter
import { Footer } from "./components/Footer/Footer";
import About from "./components/Main/About/About";
import { Contacts } from "./components/Main/Contacts/Contacts";
import { Entry }  from "./components/Main/Entry/Entry";
import { Catalog } from "./components/Main/Catalog/Catalog";
import { Login } from "./components/Main/Login/Login";
import axios from "axios";
import { StoreContext } from './stores/storeContext';
import { rootStore } from './stores/rootStore';
import Profile from './components/Main/Profile/Profile';
import AdminPanel from "./components/Main/AdminPanel/AdminPanel";
import EditCard from "./components/Main/EditCard/EditCard";
import {Appointment} from "./components/Main/Appointment/Appointment";
import {Appointments} from "./components/Main/Appointment/Appointments";
import DoctorPanel from "./components//Main/DoctorPanel/DoctorPanel";

function App() {
  axios.defaults.baseURL = 'http://localhost:8080';

  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const ProtectedRoute = ({ children, roles }) => {
    const { authStore } = rootStore;
    console.log("ProtectedRoute: isAuth =", authStore.isAuth);
    const hasRequiredRole = !roles || authStore.roles.some(role => roles.includes(role));
    return authStore.isAuth && hasRequiredRole ? children : <Navigate to="/Login" />;
  };

  return (
    <StoreContext.Provider value={rootStore}>
      <Header />
      <Routes>
        <Route path="/MainContent" element={<MainContent />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/Entry" element={<Entry />} />
        <Route path="/Catalog" element={<Catalog />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ROLE_ADMIN"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-card/:id"
          element={
            <ProtectedRoute roles={["ROLE_ADMIN"]}>
              <EditCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment/:id"
          element={
            <ProtectedRoute roles={["ROLE_USER", "ROLE_ADMIN"]}>
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Appointments"
          element={
            <ProtectedRoute roles={["ROLE_USER", "ROLE_ADMIN"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute roles={["ROLE_DOCTOR"]}>
              <DoctorPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/Entry/:cardId" element={<Entry />} />
      </Routes>
      <Footer />
    </StoreContext.Provider>
  );
}

export default App;