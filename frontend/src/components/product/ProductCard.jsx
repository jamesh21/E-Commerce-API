import Card from 'react-bootstrap/Card';

import { COMING_SOON_IMAGE_URL } from '../../constants/constant'
function ProductCard({ product, textContent, CustomButton, CustomButton2 }) {

    return (
        <Card className="shadow product-card h-100">
            <Card.Img variant="top" alt={product.productName} src={product.imageUrl || COMING_SOON_IMAGE_URL}></Card.Img>
            <Card.Body className="d-flex flex-column p-3">
                <Card.Title>{product.productName}</Card.Title>
                <Card.Subtitle>
                    ${product.price}
                </Card.Subtitle>
                <Card.Text>
                    {textContent && textContent(product)}
                </Card.Text>
                {CustomButton}
                {CustomButton2}
            </Card.Body>
        </Card>
    )
}

export default ProductCard