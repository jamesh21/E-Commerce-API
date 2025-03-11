import CartItem from './CartItem'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function CartItemList({ cartItems, updateCartItemQuantity, onDelete }) {
    return (
        <>
            <Row className="shadow rounded">
                {cartItems.map((cartItem) => (
                    <Col key={cartItem.cartItemId} sm={12}>
                        <hr />
                        <CartItem
                            cartItem={cartItem}
                            onQuantityChange={updateCartItemQuantity}
                            onDelete={onDelete}>
                        </CartItem>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default CartItemList

