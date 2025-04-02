import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/layout/NavBar'
import ProductsPage from "./pages/ProductsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ManagePage from "./pages/ManagePage.jsx";
import CartPage from "./pages/CartPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import SuccessPage from "./pages/SuccessPage.jsx"
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <Router>
            <NavBar></NavBar>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/manage" element=
                    {
                        <ProtectedAdminRoute>
                            <ManagePage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route path="/cart" element=
                    {
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/success" element={<SuccessPage />} />
            </Routes>
        </Router>
    );
}

export default App;
