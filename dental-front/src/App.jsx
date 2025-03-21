import {Header} from "./components/Header/Header"
import { MainContent } from "./components/Main/MainContent/MainContent";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer/Footer"
import About from "./components/Main/About/About";



function App() {

   return (
    <>
      <Header/>
      <Routes>
        <Route path="/MainContent" element={<MainContent/>}></Route>
        <Route path="/About" element={<About/>}/>
        
      </Routes>
      <Footer/>
    </>
  );
}
 
export default App;