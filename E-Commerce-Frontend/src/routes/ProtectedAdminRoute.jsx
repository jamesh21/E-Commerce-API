import { Navigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'

/**
 * Route protector for admins to access
 * @param {*} param0 
 * @returns 
 */
const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) {
        return <p>Loading...</p>
    }

    return user && user.isAdmin ? children : <Navigate to="/products" replace />
}

export default ProtectedAdminRoute