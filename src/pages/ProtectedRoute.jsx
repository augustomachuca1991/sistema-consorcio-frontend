import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useState, useEffect } from "react";

const { VITE_BASE_URL } = import.meta.env

export default function ProtectedRoute() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [showRedirecting, setShowRedirecting] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate(`/`);
        }
    }, [auth.isAuthenticated, navigate]);

    /* if (showRedirecting) {
      return <LoadingScreen />;
    } */

    return !!auth.isAuthenticated && <Outlet />;
}