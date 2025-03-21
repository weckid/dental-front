import {Header} from "./components/Header/Header"
import { MainContent } from "./components/Main/MainContent/MainContent";
import { Routes, Route } from "react-router-dom";
function App() {

   return (
    <>
      <Header/>
      <Routes>
        <Route path="/MainContent" element={<MainContent/>}></Route>
      </Routes>
    </>
  );
}
 
export default App;