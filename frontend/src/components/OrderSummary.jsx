
import Button from 'react-bootstrap/Button';
import displayCurrency from '../utils/helper';
import Row from 'react-bootstrap/Row'
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
        <div style={{ minHeight: '300px' }} className="shadow rounded sticky-top d-flex flex-column">
            <h3 className="py-4 px-3" >Order Summary</h3>
            {/* <Row className="px-5"> */}
            <div className="px-5">
                {calculateCartItemTotal()}
                <div className="mb-3">{calculateQuantityOrdered()} items</div>
            </div>
            <div className="text-center h100 mt-auto mb-5">
                <Button style={{ width: '90%' }} onClick={onCheckout} size="lg" variant="success">Check out</Button>
            </div>

        </div>
    )
}

export default OrderSummary
