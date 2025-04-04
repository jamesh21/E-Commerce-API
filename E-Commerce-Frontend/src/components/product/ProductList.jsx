import { useState } from "react";
import { useCart } from '../../context/CartContext'
import { useProduct } from '../../context/ProductContext'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useError } from '../../context/ErrorContext'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import CloseButton from 'react-bootstrap/CloseButton';
import ProductCard from "./ProductCard";
import AddToCartButton from './AddToCartButton'
import { TIMED_OUT_ERR_MSG, NETWORK_ERR_MSG, TIMED_OUT_CASE } from '../../constants/constant'

function ProductList() {
    // Contexts
    const { addToCart } = useCart()
    const { products } = useProduct()
    const { user } = useAuth()
    const { showError } = useError()
    const navigate = useNavigate()

    const [showToast, setShowToast] = useState(false)
    const toggleShowToast = () => setShowToast(!showToast)

    /**
     * This function calls the backend to add product to user's cart
     * @param {*} product 
     * @returns 
     */
    const handleAddToCart = async (product) => {
        if (!user) { // navigates to login page if user is logged in
            navigate('/login')
            return
        }
        try {
            await addToCart(product)
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            if (error.code === TIMED_OUT_CASE) { // timed out request
                showError(TIMED_OUT_ERR_MSG)
            }
            else if (!error.response) { // network error
                showError(NETWORK_ERR_MSG)
            }
            else {
                showError('Adding product failed, please try again')
            }
        }
    }

    return (
        <Container>
            <ToastContainer className="p-3 sticky-toast">
                <Toast bg="success" show={showToast} onClose={toggleShowToast}>
                    <Toast.Body className="d-flex justify-content-between white-text">
                        <span>
                            <i className="bi bi-bag-check-fill mx-3"></i>
                            Product added to cart
                        </span>
                        <CloseButton variant="white" onClick={toggleShowToast}></CloseButton>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
            <Row>
                {products.map((product) => (
                    <Col key={product.productId} xl={3} lg={4} md={6} className="mb-4">
                        <ProductCard
                            product={product}
                            textContent={(product) => product.stock <= 5 && product.stock > 0 && <span className="red-text">Only {product.stock} left</span>}
                            CustomButton={
                                <AddToCartButton
                                    product={product}
                                    handleAddToCart={handleAddToCart}
                                >
                                </AddToCartButton>}>
                        </ProductCard>
                    </Col>
                ))}
            </Row>
        </Container >
    )
}

export default ProductList