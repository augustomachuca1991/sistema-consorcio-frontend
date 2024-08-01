import React, { useContext, createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const { VITE_BASE_URL } = import.meta.env

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => { },
    saveUser: (userData) => { },
    getRefreshToken: () => { },
    getUser: () => { },
    signOut: () => { },
    //getRoles: () => {},
});

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAutheticated] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        checkAuth();
    }, []);

    const requestNewAccessToken = async (token) => {
        try {
            const response = await fetch(`${VITE_BASE_URL}/api/token/refresh/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ refresh: refreshToken })
            })

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const { access } = await response.json();
            return access
        } catch (error) {
            console.log(error)
            return null;

        }
    }

    /* const getUserInfo = async (accessToken) => {
        try {
            const response = await fetch(`${VITE_BASE_URL}/api/token/refresh/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ refresh: refreshToken })
            })

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const { access } = await response.json();
            return access
        } catch (error) {
            console.log(error)
            return null;

        }
    } */


    const checkAuth = async () => {
        setIsLoading(false);
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            if (user) {
                saveUser({ token: accessToken, refresh: getRefreshToken(), user: user })
                setIsLoading(false)
                return;
            }
        } else {
            const token = getRefreshToken();
            if (token) {
                const newAccessToken = await requestNewAccessToken(token)
                if (newAccessToken) {
                    if (user) {
                        saveUser({ token: newAccessToken, refresh: token, user: user })
                        setIsLoading(false)
                        return;
                    }
                }
            }
            setAccessToken(null);
            setIsAutheticated(false);
        }

        setIsLoading(false);
    };

    const getAccessToken = () => {
        return accessToken;
    };

    const getRefreshToken = () => {
        const tokenData = localStorage.getItem("token");
        if (tokenData) {
            const { token } = JSON.parse(tokenData);
            return token;
        }
        return null;
    };

    const saveUser = ({ token, refresh, user }) => {
        setAccessToken(token);
        setRefreshToken(refresh);
        setUser(user);
        localStorage.setItem("token", JSON.stringify(refreshToken));
        setIsAutheticated(true);
    };

    const getUser = () => {
        return user;
    };

    /* const getRoles = () => {
      return roles;
    }; */

    const signOut = () => {
        setIsAutheticated(false);
        setAccessToken("");
        setUser(undefined);
        localStorage.removeItem("token");
        //localStorage.removeItem("refresh");
        //localStorage.removeItem("roles");
        //if (localStorage.getItem("isRedirect")) localStorage.removeItem("isRedirect");
    };

    return React.createElement(
        AuthContext.Provider,
        {
            value: {
                isAuthenticated,
                getAccessToken,
                saveUser,
                getRefreshToken,
                getUser,
                signOut,
            },
        },
        isLoading ? React.createElement("div", null, "Loading...") : children
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
