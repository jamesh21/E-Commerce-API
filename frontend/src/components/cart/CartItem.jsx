import { useCart } from '../../context/CartContext'
import { useError } from '../../context/ErrorContext'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import CloseButton from 'react-bootstrap/CloseButton';
import displayCurrency from '../../utils/helper'
import { PLACE_HOLDER_IMG, TIMED_OUT_ERR_MSG, NETWORK_ERR_MSG, TIMED_OUT_CASE } from '../../constants/constant'

function CartItem({ cartItem }) {
    const { updateCartItemQuantity, deleteFromCart } = useCart()
    const { showError } = useError()
    const qtyDropDown = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const handleQuantityChange = async (eventKey) => {
        try {
            await updateCartItemQuantity(cartItem.cartItemId, Number(eventKey))
        } catch (err) {
            if (err.code === TIMED_OUT_CASE) {
                showError(TIMED_OUT_ERR_MSG)
            } else if (!err.response) {
                showError(NETWORK_ERR_MSG)
            } else {
                showError('Something went wrong, please try again')
            }
        }
    }

    const handleClose = async () => {
        try {
            await deleteFromCart(cartItem.cartItemId)
        } catch (err) {
            if (err.code === TIMED_OUT_CASE) {
                showError(TIMED_OUT_ERR_MSG)
            } else if (!err.response) {
                showError(NETWORK_ERR_MSG)
            } else {
                showError('Something went wrong, please try again')
            }
        }
    }

    return (
        <Row className="cart-item">
            <Col lg={4} style={{ maxHeight: '200px', overflow: 'hidden' }}>
                <Image src={cartItem.imageUrl || PLACE_HOLDER_IMG}></Image>
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