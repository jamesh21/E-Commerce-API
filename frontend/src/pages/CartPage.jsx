import { Row, Col, Container } from 'react-bootstrap'
import CartItemList from '../components/CartItemList'
function CartPage() {
    return (
        <Container className="mt-5">
            <Row>
                <Col lg={9}>
                    <h2 className="mb-4">Cart</h2>
                    <CartItemList></CartItemList>
                </Col>
                <Col>
                    <h2>Order Summary</h2>
                </Col>

            </Row>

        </Container>)
}

export default CartPage;