import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export function ProductCard({ product }) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{product.product_name}</Card.Title>
                <Card.Text>Price: ${product.price}</Card.Text>
                <Button variant="primary">Add to Cart</Button>
            </Card.Body>
        </Card>
    )
}