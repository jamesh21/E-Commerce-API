import { Image, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import { useState } from "react";

function CartItem({ cartItem, onQuantityChange }) {
    const qtyDropDown = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [qtySelected, setQtySelected] = useState(1)
    const displayCurrency = (amount) => {
        const formatedCurrency = amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        })

        return formatedCurrency
    }

    const handleQuantityChange = (eventKey) => {
        setQtySelected(eventKey)
        onQuantityChange(cartItem.cart_item_id, eventKey)
        console.log(eventKey)
    }

    return (
        <Row>
            <Col lg={2} style={{ maxHeight: '200px', overflow: 'hidden' }}>
                <Image thumbnail style={{ objectFit: 'cover', width: '100%', height: '100%' }} fluid src={cartItem.image_url || "https://plus.unsplash.com/premium_photo-1734543932103-37f616c1b0b1?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}></Image>
            </Col>

            <Col>
                <div className="my-3">{cartItem.product_name}</div>
                <DropdownButton onSelect={handleQuantityChange} variant="secondary" size="sm" id="dropdown-basic-button" title={`Qty ${qtySelected}`}>
                    {qtyDropDown.map((qtyVal) => (
                        <Dropdown.Item key={qtyVal} eventKey={qtyVal} active={qtySelected == qtyVal}>
                            Qty {qtyVal}
                        </Dropdown.Item>))}
                </DropdownButton>
            </Col>

            <Col>
                <div className="my-3">{displayCurrency(cartItem.price * cartItem.quantity)}</div>
                {cartItem.quantity > 1 && <div>each ${cartItem.price}</div>}
            </Col>

        </Row>)
}

export default CartItem