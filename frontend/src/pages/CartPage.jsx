import { Row, Col, Container } from 'react-bootstrap'
import CartItemList from '../components/CartItemList'
import OrderSummary from '../components/OrderSummary'
import { useState, useEffect, useRef } from "react"
import formatApiFields from '../utils/db-mapping'
import axiosInstance from '../services/axios'
import EmptyCart from '../components/EmptyCart'

function CartPage() {
    const [cartItems, setCartItems] = useState([])
    const previousCartItems = useRef(cartItems)

    const updateCartItemQuantity = async (cartItemId, newQuantity) => {
        try {
            // store previous cart items in case we need to revert due to errors
            previousCartItems.current = cartItems
            // Update new quantity of cart item id passed in.
            console.log('before setting ', cartItems)
            setCartItems((prevItems) =>
                prevItems.map((item) => item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item)
            )
            // Attempt to update DB with new quantity
            await axiosInstance.patch(`/cart/item/${cartItemId}`, { quantity: newQuantity })

        } catch (err) {
            console.error("Error ", err)
            setCartItems(previousCartItems.current)
        }
    }

    const onDelete = async (cartItemId) => {
        try {
            previousCartItems.current = cartItems
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.cartItemId !== cartItemId)
            )
            // Delete cart item from DB
            await axiosInstance.delete(`/cart/item/${cartItemId}`)

        } catch (err) {
            // revert delete, if fails
            setCartItems(previousCartItems.current)
            console.error("Error ", err)
        }
    }

    const onCheckout = async () => {
        try {
            const response = await axiosInstance.post('/checkout')
            if (response.data.url) {
                window.location.href = response.data.url
            }
        } catch (err) {
            console.error('Error ', err)
        }
    }

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosInstance.get('/cart/item')
                const responseData = await response.data
                const formattedData = formatApiFields(responseData.data)

                setCartItems(formattedData)
            } catch (err) {
                console.error("Error: ", err)
            }
        }
        fetchCartItems()
    }, [])


    return (
        <Container className="mt-5">
            <Row className="g-5">
                {cartItems.length === 0 ? <EmptyCart></EmptyCart> :
                    (<>
                        <Col lg={9}>
                            <h2 className="mb-4">Cart</h2>
                            <CartItemList cartItems={cartItems} updateCartItemQuantity={updateCartItemQuantity} onDelete={onDelete}></CartItemList>
                        </Col>
                        <Col>
                            <OrderSummary cartItems={cartItems} onCheckout={onCheckout}></OrderSummary>
                        </Col>
                    </>)
                }
            </Row>
        </Container>)
}

export default CartPage;