
import Button from 'react-bootstrap/Button';
import displayCurrency from '../utils/helper';

function OrderSummary({ cartItems }) {
    const calculateCartItemTotal = () => {
        const total = cartItems.reduce((accu, currentItem) => accu + (currentItem.quantity * currentItem.price), 0)

        return displayCurrency(total)
    }
    return (
        <>
            <h3>{calculateCartItemTotal()}</h3>
            <Button variant="success">Check out</Button>
        </>
    )
}

export default OrderSummary
