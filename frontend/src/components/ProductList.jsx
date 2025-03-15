import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import CloseButton from 'react-bootstrap/CloseButton';
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axios";
import { useCart } from '../context/CartContext'
import { useProduct } from '../context/ProductContext'
function ProductList() {
    // const [products, setProducts] = useState([])
    const [showToast, setShowToast] = useState(false)
    const toggleShowToast = () => setShowToast(!showToast)
    const { addToCart } = useCart()
    const { products } = useProduct()
    // useEffect(() => {
    //     const fetchedProducts = async () => {
    //         try {
    //             const response = await axiosInstance.get('/product')
    //             const responseData = response.data
    //             setProducts(responseData.data)
    //         } catch (err) {
    //             console.error(err)
    //         }
    //     }
    //     fetchedProducts()
    // }, [])

    const handleAddToCart = (product) => {
        addToCart(product)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000);

    }

    return (
        <Container>
            <ToastContainer position="top-center" className="p-3">
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
                    <Col key={product.productId} lg={3} className="mb-4">
                        <ProductCard product={product} handleAddToCart={handleAddToCart}></ProductCard>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default ProductList