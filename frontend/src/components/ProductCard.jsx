import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ProductCard({ product }) {
    return (
        <Card>
            <Card.Body>
                <Card.Img style={{ height: "200px", objectFit: "cover" }} variant="top" alt={product.product_name} src={product.image_url || "https://plus.unsplash.com/premium_photo-1734543932103-37f616c1b0b1?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}></Card.Img>
                <Card.Title>{product.product_name}</Card.Title>
                <Card.Text>Price: ${product.price}</Card.Text>
                <Button variant="primary">Add to Cart</Button>
            </Card.Body>
        </Card>
    )
}

export default ProductCard