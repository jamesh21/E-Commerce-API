
import Button from 'react-bootstrap/Button';
import displayCurrency from '../utils/helper';

function OrderSummary({ cartItems, onCheckout }) {
    const calculateCartItemTotal = () => {
        const total = cartItems.reduce((accu, currentItem) => accu + (currentItem.quantity * currentItem.price), 0)
        return displayCurrency(total)
    }
    const calculateQuantityOrdered = () => {
        const total = cartItems.reduce((accu, currItem) => accu + currItem.quantity, 0)
        return total
    }

    return (
        <div style={{ minHeight: '350px' }} className="shadow rounded sticky-top">
            <h3 className="py-4 px-3" >Order Summary</h3>
            <div className="px-5">
                <div>{calculateCartItemTotal()}</div>
                <div className="mb-3">{calculateQuantityOrdered()} items</div>
            </div>

            <div className="text-center">
                <Button style={{ width: '90%' }} onClick={onCheckout} size="lg" variant="success">Check out</Button>
            </div>
        </div>
    )
}

export default OrderSummary
