import { Routes, Route } from "react-router-dom"
import { useState } from 'react'
import { lazy, Suspense } from 'react';
import './index.css'
import LoadingComponent from "./components/LoadingComponent.jsx";


const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));


function App() {

  return (
    <Suspense fallback={<LoadingComponent/>}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Routes>
    </Suspense>

  )
}

export default App
