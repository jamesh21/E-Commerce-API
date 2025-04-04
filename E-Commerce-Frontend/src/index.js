import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorModal from './components/common/ErrorModal';
import "bootstrap-icons/font/bootstrap-icons.css";
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { ErrorProvider } from './context/ErrorContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ErrorProvider>
            <ProductProvider>
                <AuthProvider>
                    <CartProvider>
                        <App />
                        <ErrorModal />
                    </CartProvider>
                </AuthProvider>
            </ProductProvider>
        </ErrorProvider>
    </React.StrictMode>
);


reportWebVitals();
