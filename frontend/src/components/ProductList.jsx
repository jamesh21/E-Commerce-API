import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function ProductList() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        // getProductsFromAPI().then(setProducts)
        const fetchedProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/product", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                })
                if (!response.ok) {
                    throw new Error("Error calling api")
                }
                const result = await response.json()
                console.log(result.data)
                setProducts(result.data)
            } catch (err) {
                console.error(err)
            }
        }
        console.log(products)
        fetchedProducts()
    }, [])

    // const getProductsFromAPI = async () => {
    //     try {
    //         const response = await fetch("http://localhost:3000/api/v1/product", {
    //             method: "GET",
    //             headers: { "Content-Type": "application/json" }
    //         })
    //         if (!response.ok) {
    //             throw new Error("Error calling api")
    //         }
    //         const result = await response.json()
    //         console.log(result)
    //         return result.data
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    return (
        <Container>
            <Row>
                {products.map((product) => (
                    <Col key={product.product_id} lg={3} className="mb-4"><ProductCard product={product}></ProductCard></Col>
                ))}
            </Row>
        </Container>

    )
}