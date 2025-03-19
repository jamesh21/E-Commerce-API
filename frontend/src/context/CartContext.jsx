
import { createContext, useState, useContext, useEffect, useRef } from 'react';
import axiosInstance from '../services/axios'

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])

    const previousCartItems = useRef(cartItems)


    useEffect(() => {
        const getCartItems = async () => {

            try {
                const response = await axiosInstance.get('/cart/item')
                const responseData = response.data

                setCartItems(responseData.data)

            } catch (err) {
                console.error('Error ', err)
            }
        }
        getCartItems()
    }, [])

    const updateCartItemQuantity = async (cartItemId, newQuantity) => {
        try {
            // store previous cart items in case we need to revert due to errors
            previousCartItems.current = cartItems
            // Update new quantity of cart item id passed in.
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

    const deleteFromCart = async (cartItemId) => {
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

    const removeDeletedProductFromCart = (productId) => setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
    const addToCart = async (product) => {

        try {
            previousCartItems.current = cartItems
            // insert new 
            const response = await axiosInstance.post('/cart/item', { productId: product.productId, quantity: 1 })
            const addedProduct = response.data

            const cartItemProduct = { ...product, cartId: addedProduct.cartId, cartItemId: addedProduct.cartItemId, quantity: addedProduct.quantity }

            setCartItems((prevCart) => {
                const existingItem = prevCart.find((item) => item.productId === product.productId)
                if (existingItem) { // already in our cart, just need to update quantity
                    return prevCart.map((item) => item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
                    )
                } else {
                    return [...prevCart, { ...cartItemProduct }]
                }
            })

        } catch (err) {
            // revert delete, if fails
            setCartItems(previousCartItems.current)
            console.error('error ', err)
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


    return (
        <CartContext.Provider value={{ cartItems, updateCartItemQuantity, deleteFromCart, onCheckout, addToCart, removeDeletedProductFromCart }}>
            {children}
        </CartContext.Provider>
    )
}


export const useCart = () => useContext(CartContext)