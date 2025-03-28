import Button from 'react-bootstrap/Button';
import displayCurrency from '../../utils/helper';
import { useCart } from '../../context/CartContext'
import { useError } from '../../context/ErrorContext'
import { TIMED_OUT_ERR_MSG, NETWORK_ERR_MSG, TIMED_OUT_CASE } from '../../constants/constant'
function OrderSummary() {
    const { cartItems, onCheckout } = useCart()
    const { showError } = useError()
    const calculateCartItemTotal = () => {
        const total = cartItems.reduce((accu, currentItem) => accu + (currentItem.quantity * currentItem.price), 0)
        return displayCurrency(total)
    }
    const totalCartQuantity = cartItems.reduce((accu, currItem) => accu + currItem.quantity, 0)

    const handleClick = async () => {
        try {
            await onCheckout()
        } catch (err) {
            if (err.code === TIMED_OUT_CASE) {
                showError(TIMED_OUT_ERR_MSG)
            }
            else if (!err.response) {
                showError(NETWORK_ERR_MSG)
            } else if (err.response?.data?.code === 'INSUFFICIENT_STOCK') {
                showError('Insufficient stock for some products in your cart')
            }
            else {
                showError('Something went wrong, please try again')
            }
        }
    }

    return (
        <div style={{ minHeight: '300px' }} className="shadow rounded sticky-top d-flex flex-column">
            <h3 className="py-4 px-3" >Order Summary</h3>

            <div className="px-5">
                {calculateCartItemTotal()}
                <div className="mb-3">{totalCartQuantity} items</div>
            </div>
            <div className="text-center h100 mt-auto mb-5">
                <Button style={{ width: '90%' }} onClick={handleClick} size="lg" variant="dark">Check out</Button>
            </div>

        </div>
    )
}

export default OrderSummary
