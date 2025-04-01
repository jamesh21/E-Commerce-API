import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import CartItemList from '../components/cart/CartItemList'
import OrderSummary from '../components/cart/OrderSummary'
import EmptyCart from '../components/cart/EmptyCart'
import { useCart } from '../context/CartContext'

function CartPage() {
    const { cartItems } = useCart()

    return (
        <Container className="mt-5">
            <Row className="g-5">
                {cartItems.length === 0 ? <EmptyCart></EmptyCart> :
                    (<>
                        <Col lg={8}>
                            <h2 className="mb-4">Cart</h2>
                            <CartItemList></CartItemList>
                        </Col>
                        <Col lg={4}>
                            <OrderSummary></OrderSummary>
                        </Col>
                    </>)
                }
            </Row>
        </Container>)
}

export default CartPage;