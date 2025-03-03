import { Row, Col, Container } from 'react-bootstrap'
import CartItemList from '../components/CartItemList'
import OrderSummary from '../components/OrderSummary'
import { useState, useEffect, useRef } from "react"
import formatApiFields from '../utils/db-mapping'
import axiosInstance from '../services/axios'

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
                prevItems.map((item) => item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
                )
            )
            // Attempt to update DB with new quantity
            await axiosInstance.patch(`/cart/item/${cartItemId}`, { quantity: newQuantity })

        } catch (err) {
            console.error("Error ", err)
            setCartItems(previousCartItems.current)
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
            <Row>
                <Col lg={9}>
                    <h2 className="mb-4">Cart</h2>
                    <CartItemList cartItems={cartItems} updateCartItemQuantity={updateCartItemQuantity}></CartItemList>
                </Col>
                <Col>
                    <h2 className="mb-4" >Order Summary</h2>
                    <OrderSummary cartItems={cartItems} ></OrderSummary>
                </Col>
            </Row>
        </Container>)
}

export default CartPage;