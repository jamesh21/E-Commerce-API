import Card from 'react-bootstrap/Card';

import { COMING_SOON_IMAGE_URL } from '../../constants/constant'
function ProductCard({ product, CustomButton, CustomButton2 }) {

    return (
        <Card className="shadow product-card h-100">
            <Card.Img variant="top" alt={product.productName} src={product.imageUrl || COMING_SOON_IMAGE_URL}></Card.Img>
            <Card.Body className="d-flex flex-column p-3">
                <Card.Title>{product.productName}</Card.Title>
                <Card.Subtitle>
                    {product.stock !== 0 && <>${product.price}</>}
                </Card.Subtitle>
                <Card.Text>
                    {product.stock <= 5 && product.stock > 0 && <>Low stock {product.stock} left</>}
                </Card.Text>
                {CustomButton}
                {CustomButton2}
            </Card.Body>
        </Card>
    )
}

export default ProductCard