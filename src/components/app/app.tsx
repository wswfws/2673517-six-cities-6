import MainPage from "../../pages/main/main.tsx";
import Layout from "./layout.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Navigate to="/Amsterdam"/>}/>
          <Route path=':city' element={<MainPage/>}/>
        </Route>
        <Route path="*" element={"МЯУ"}/>
      </Routes>
    </BrowserRouter>
  )
}
