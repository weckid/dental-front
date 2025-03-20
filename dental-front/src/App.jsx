import {Routes, Route} from "react-router-dom";
import { Header } from "./components/Header/Header";
import  MainContent from "./components/Main/MainContent/MainContent"


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