import {Header} from "./components/Header/Header"
import { MainContent } from "./components/Main/MainContent/MainContent";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer/Footer"
import About from "./components/Main/About/About";
import { Contacts } from "./components/Main/Contacts/Contacts"
import { Entry } from "./components/Main/Entry/Entry"

function App() {

   return (
    <>
      <Header/>
      <Routes>
        <Route path="/MainContent" element={<MainContent/>}></Route>
        <Route path="/About" element={<About/>}/>
        <Route path="/Contacts" element={<Contacts/>}></Route>
        <Route path="/Entry" element={<Entry/>}></Route>
      </Routes>
      <Footer/>
    </>
  );
}
 
export default App;