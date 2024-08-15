import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect } from "react";

export default function ProtectedRoute() {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(`/`);
        }
    }, [isAuthenticated]);

    return !!isAuthenticated && <Outlet />;
}