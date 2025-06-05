import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Users from "./pages/user/Users"
import User from "./pages/user/User"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Account from "./pages/Account"

import Sidebar from "./layout/Sidebar"
import ErrorBoundary from "./components/ErrorBoundary"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
            <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={
              <ProtectedRoute requiredRole={['admin']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/user/:id" element={
              <ProtectedRoute requiredRole={['admin']}>
                <User />
              </ProtectedRoute>
            } />

            <Route path="/account" element={<Account />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
