import { useState, useEffect } from "react"
import axiosInstance from '../services/axios'
import CartItem from './CartItem'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function CartItemList() {
    const [cartItems, setCartItems] = useState([])
    const updateCartItemQuantity = async (cartItemId, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        )
    }
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosInstance.get('/cart/item')
                const responseData = await response.data
                console.log(responseData)
                setCartItems(responseData.data)
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
                    <Col key={cartItem.cart_item_id} sm={12} className="mb-4">
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

