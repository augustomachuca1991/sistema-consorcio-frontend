import { AuthProvider } from "./auth/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client'
import './boot/translate/i18n.js'
import App from './App.jsx'
import './styles/index.css'
import './styles/custom.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)
