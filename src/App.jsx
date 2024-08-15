import { Routes, Route } from "react-router-dom"
import { useState } from 'react'
import { lazy, Suspense } from 'react';
import './index.css'
import LoadingComponent from "./components/LoadingComponent.jsx";


const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const BuildingsPage = lazy(() => import('./pages/BuildingsPage.jsx'));
const ProtectedRoute = lazy(() => import('./pages/ProtectedRoute.jsx'));



function App() {

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="edificios" element={<BuildingsPage />} />
        </Route>
      </Routes>
    </Suspense>

  )
}

export default App
