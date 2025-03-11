import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import CloseButton from 'react-bootstrap/CloseButton';
import displayCurrency from '../utils/helper'

function CartItem({ cartItem, onQuantityChange, onDelete }) {
    const qtyDropDown = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const handleQuantityChange = (eventKey) => {
        onQuantityChange(cartItem.cartItemId, Number(eventKey))
    }
    const handleClose = () => {
        onDelete(cartItem.cartItemId)
    }

    return (
        <Row className="cart-item">
            <Col lg={4} style={{ maxHeight: '200px', overflow: 'hidden' }}>
                <Image src={cartItem.imageUrl || "https://plus.unsplash.com/premium_photo-1734543932103-37f616c1b0b1?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}></Image>
            </Col>

            <Col className="px-4">
                <div className="my-3">{cartItem.productName}</div>
                <DropdownButton onSelect={handleQuantityChange} variant="secondary" size="sm" id="dropdown-basic-button" title={`Qty ${cartItem.quantity}`}>
                    {qtyDropDown.map((qtyVal) => (
                        <Dropdown.Item key={qtyVal} eventKey={qtyVal} active={cartItem.quantity == qtyVal}>
                            Qty {qtyVal}
                        </Dropdown.Item>))}
                </DropdownButton>
            </Col>
            <Col className='d-flex justify-content-between'>
                <div className="my-3">{displayCurrency(cartItem.price * cartItem.quantity)}
                    {cartItem.quantity > 1 && <div>each ${cartItem.price}</div>}
                </div>
                <CloseButton onClick={handleClose}></CloseButton>
            </Col>
        </Row>)
}

export default CartItem