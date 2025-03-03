import { useState, useEffect } from "react"
import axiosInstance from '../services/axios'
import CartItem from './CartItem'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import formatApiFields from '../utils/db-mapping'


function CartItemList() {
    const [cartItems, setCartItems] = useState([])
    const updateCartItemQuantity = async (cartItemId, newQuantity) => {

        try {
            // Update new quantity of cart item id passed in.
            setCartItems((prevItems) =>
                prevItems.map((item) => item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
                )
            )
            //TODO: will need to have DB call before updating local state. If DB call fails, don't update state
            const response = await axiosInstance.patch(`/cart/item/${cartItemId}`, { quantity: newQuantity })
            const responseData = await response.data
            console.log("From updating quantity ", response)
        } catch (err) {
            console.err("Error ", err)
        }
    }

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosInstance.get('/cart/item')
                const responseData = await response.data

                setCartItems(formatApiFields(responseData.data))
            } catch (err) {
                console.error("Error: ", err)
            }
        }
        fetchCartItems()
    }, [])

    return (
        <>
            <hr />
            <Row>
                {cartItems.map((cartItem) => (
                    <Col key={cartItem.cartItemId} sm={12} className="mb-4">
                        <CartItem
                            cartItem={cartItem}
                            onQuantityChange={updateCartItemQuantity}>
                        </CartItem>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default CartItemList

