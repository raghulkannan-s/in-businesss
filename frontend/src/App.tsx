import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Users from "./pages/Users"

import Sidebar from "./layout/sideBar"

function App() {

  return (
    <BrowserRouter>
        <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
