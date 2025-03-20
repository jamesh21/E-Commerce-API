import { Navigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'
const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) {
        return <p>Loading...</p>
    }

    return user.isAdmin ? children : <Navigate to="/products" replace />
}

export default ProtectedAdminRoute