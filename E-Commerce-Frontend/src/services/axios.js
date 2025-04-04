import axios from "axios";

/**
 * Create Axios instance for calling backend API
 */
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})


// Add a request interceptor to include bearer token.
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Retrieve token from storage
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`; // Attach token
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance