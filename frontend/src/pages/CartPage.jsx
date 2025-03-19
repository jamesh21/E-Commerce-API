import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import CartItemList from '../components/CartItemList'
import OrderSummary from '../components/OrderSummary'
import EmptyCart from '../components/EmptyCart'
import { useCart } from '../context/CartContext'

function CartPage() {
    const { cartItems } = useCart()


    return (
        <Container className="mt-5">
            <Row className="g-5">
                {cartItems.length === 0 ? <EmptyCart></EmptyCart> :
                    (<>
                        <Col lg={9}>
                            <h2 className="mb-4">Cart</h2>
                            <CartItemList></CartItemList>
                        </Col>
                        <Col>
                            <OrderSummary></OrderSummary>
                        </Col>
                    </>)
                }
            </Row>
        </Container>)
}

export default CartPage;