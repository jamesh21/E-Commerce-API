import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar'
import ProductsPage from "./pages/ProductsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NewProductPage from "./pages/NewProductPage.jsx";
import CartPage from "./pages/CartPage.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <Router>
            <NavBar></NavBar>
            <Routes>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/new-product" element={<NewProductPage />} />
                <Route path="/cart" element=
                    {
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>

    );
}

export default App;
