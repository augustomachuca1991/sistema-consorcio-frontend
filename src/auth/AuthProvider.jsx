import React, { useContext, createContext, useState, useEffect} from "react";
import PropTypes from "prop-types";

const { VITE_API_URL } = import.meta.env

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => { },
    saveUser: ({token, refresh, user}) => { },
    getRefreshToken: () => { },
    getUser: () => { },
    signOut: () => { },
});

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAutheticated] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkAuth();
      }, []);

    const requestNewAccessToken = async (token) => {
        try {
            const response = await fetch(`${VITE_API_URL}/api/token/refresh/`, {
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

    const checkAuth = async () => {
        setIsLoading(false);
        const accessToken = localStorage.getItem("accessToken");
        const user = JSON.parse(localStorage.getItem("user"));
        if (accessToken && user?.id) {
            setAccessToken(accessToken);
            setIsAutheticated(true);
            setUser(user);
          } else {
            setAccessToken("");
            setRefreshToken("");
            setIsAutheticated(false);
          }
      
          setIsLoading(false);
        /* const accessToken = localStorage.getItem("accessToken");
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
            setAccessToken("");
            setRefreshToken("");
            setUser({})
            setIsAutheticated(false);
        }

        setIsLoading(false); */
    };

    const saveUser = ({token, refresh, user}) => {
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setAccessToken(token);
        setRefreshToken(refresh);
        setUser(user);
        setIsAutheticated(true);
    };


    const signOut = () => {
        setIsAutheticated(false);
        setAccessToken("");
        setRefreshToken("")
        setUser({});
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    };

    const getUser = () => {
        return user;
    };

    const getAccessToken = () => {
        return accessToken;
    };

    const getRefreshToken = () => {
        return refreshToken;
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
        isLoading ? React.createElement("div", null, "Loading....") : children
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
