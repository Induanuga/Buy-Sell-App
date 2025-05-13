import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));

    const setAuthToken = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, setAuthToken, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};