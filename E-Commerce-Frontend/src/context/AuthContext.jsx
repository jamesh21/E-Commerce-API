import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from '../services/axios'
const AuthContext = createContext();

/**
 * Auth context will be used to login/logout users and retrieve logged in user's data.
 * @param {*} param0 
 * @returns 
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    /**
     * Attempts to retrieve user info if token is available in local storage.
     */
    useEffect(() => {
        const getUserInfo = async () => {
            if (token && !user) {
                try {
                    const response = await axiosInstance.get('/user')
                    setUser(response.data)
                } catch (err) {
                    console.error('Error: ', err)
                }
            }
            setLoading(false)
        }
        getUserInfo()
    }, [token])

    /**
     * Log in user by setting user data and token in local storage
     * @param {*} userData 
     * @param {*} authToken 
     */
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("token", authToken); // Store token
    };

    /**
     * Logs out user and removes token from storage. 
     * @param {*} navigate 
     */
    const logout = (navigate) => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token"); // Remove token
        navigate('/login')

    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);