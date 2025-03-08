import { Navigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'
const ProtectedAdminRoute = ({ children }) => {
    const { user } = useAuth()

    return user?.admin ? children : <Navigate to="/products" replace />
}

export default ProtectedAdminRoute