import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner'
import { useState } from 'react'

function ProductCard({ product, handleAddToCart }) {
    const [loading, setLoading] = useState(false)


    const handleClick = () => {
        handleAddToCart(product)
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 750)
    }

    return (
        <Card className="shadow product-card h-100">
            <Card.Img variant="top" alt={product.productName} src={product.imageUrl || "https://plus.unsplash.com/premium_photo-1734543932103-37f616c1b0b1?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}></Card.Img>
            <Card.Body className="d-flex flex-column p-3">

                <Card.Title>{product.productName}</Card.Title>
                <Card.Subtitle>
                    {product.stock === 0 ? "Out of stock" : <>${product.price}</>}
                </Card.Subtitle>
                <Card.Text>
                    {product.stock <= 5 && product.stock > 0 && <>Low stock {product.stock} left</>}
                </Card.Text>

                <Button className="mt-auto mb-1 mx-2" variant={product.stock === 0 ? "secondary" : "dark"} onClick={handleClick} disabled={loading || product.stock === 0}>
                    {loading ? (<>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                        />
                        Adding...
                    </>)
                        : ("Add to Cart")
                    }
                </Button>
            </Card.Body>
        </Card>
    )
}

export default ProductCard