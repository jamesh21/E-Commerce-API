import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { Row, Col, Container } from 'react-bootstrap'
import formatApiFields from '../utils/db-mapping'
import axiosInstance from "../services/axios";

function ProductList() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchedProducts = async () => {
            try {
                const response = await axiosInstance.get('/product')
                const responseData = await response.data
                setProducts(formatApiFields(responseData.data))
            } catch (err) {
                console.error(err)
            }
        }
        fetchedProducts()
    }, [])

    const handleAddToCart = async (productId, quantity) => {
        try {
            const response = await axiosInstance.post('/cart/item', { productId, quantity })
            const responseData = await response.data
        } catch (err) {
            console.error('error ', err)
        }
        console.log('adding product ', productId)
    }

    return (
        <Container>
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