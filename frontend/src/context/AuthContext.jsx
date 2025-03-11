import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from '../services/axios'
import formatApiFields from '../utils/db-mapping'
// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserInfo = async () => {
            if (token && !user) {
                try {
                    const response = await axiosInstance.get('/user')
                    setUser(formatApiFields([response.data])[0])
                } catch (err) {
                    console.error('Error: ', err)
                }
            }
            setLoading(false)
        }
        getUserInfo()
    }, [token])

    // Function to log in user
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("token", authToken); // Store token
    };

    // Function to log out user
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

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);