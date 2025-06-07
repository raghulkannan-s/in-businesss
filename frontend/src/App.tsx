import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Users from "./pages/user/Users"
import User from "./pages/user/User"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Account from "./pages/user/Account"
import Products from "./pages/product/Products"
import Product from "./pages/product/Product"

import Layout from "./layout/Layout"
import ErrorBoundary from "./components/secureRoutes//ErrorBoundary"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/secureRoutes/ProtectedRoute"
import PublicRoute from "./components/secureRoutes/PublicRoute";


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
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

            <Route path="/account" element={
              <PublicRoute>
                <Account />
              </PublicRoute>
            } />
            <Route path="/product/:id" element={
              <PublicRoute>
                <Product />
              </PublicRoute>
            } />
            <Route path="/products" element={
              <PublicRoute>
                <Products />
              </PublicRoute>
            } />

          </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
