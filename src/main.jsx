import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client'
import './boot/translate/i18n.js'
import App from './App.jsx'
import React from 'react'
import './index.css'
import { AuthProvider } from "./auth/AuthProvider";

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)
