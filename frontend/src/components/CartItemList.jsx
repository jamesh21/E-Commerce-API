import CartItem from './CartItem'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useCart } from '../context/CartContext'
function CartItemList() {
    const { cartItems } = useCart()
    return (
        <>
            <Row className="shadow rounded">
                {cartItems.map((cartItem) => (
                    <Col key={cartItem.productId} sm={12}>
                        <hr />
                        <h3>{cartItem.productId}</h3>
                        <CartItem
                            cartItem={cartItem}>
                        </CartItem>
                    </Col>
                ))}
                <div className="mb-4"></div>
            </Row>
        </>
    )
}

export default CartItemList

