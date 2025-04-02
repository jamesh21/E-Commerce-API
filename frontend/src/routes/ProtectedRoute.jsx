import { Navigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'

/**
 * Route protector to allow only logged in user to access.
 * @param {*} param0 
 * @returns 
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) {
        return <p>Loading...</p>
    }
    return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute