import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import formatApiFields from '../utils/db-mapping'
function ProductList() {
    const [products, setProducts] = useState([])
    const apiUrl = process.env.REACT_APP_API_URL
    useEffect(() => {
        // getProductsFromAPI().then(setProducts)
        const fetchedProducts = async () => {
            try {
                const response = await fetch(`${apiUrl}/product`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                })
                if (!response.ok) {
                    throw new Error("Error calling api")
                }
                const result = await response.json()
                console.log(result.data)
                setProducts(formatApiFields(result.data))
            } catch (err) {
                console.error(err)
            }
        }
        console.log(products)
        fetchedProducts()
    }, [])

    return (
        <Container>
            <Row>
                {products.map((product) => (
                    <Col key={product.productId} lg={3} className="mb-4">
                        <ProductCard product={product}></ProductCard>
                    </Col>
                ))}
            </Row>
        </Container>

    )
}

export default ProductList