
import { createContext, useState, useContext, useEffect, useRef } from 'react';
import axiosInstance from '../services/axios'
import { useAuth } from './AuthContext'
import displayCurrency from '../utils/helper';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const { user } = useAuth()
    const previousCartItems = useRef(cartItems)

    /**
     * Attempts to retrieve cart items for user
     */
    useEffect(() => {
        const getCartItems = async () => {
            // User is not logged in, therefore no cart is available.
            if (!user) {
                return
            }
            try {
                const response = await axiosInstance.get('/cart/item')
                const responseData = response.data
                setCartItems(responseData.data)

            } catch (err) {
                console.error('Error ', err)
                throw err
            }
        }
        getCartItems()
    }, [user])

    /**
     * This function updates the passed in cart item quantity in the backend and also local state.
     * @param {*} cartItemId 
     * @param {*} newQuantity 
     */
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
            throw err
        }
    }

    /**
     * THis function will update the corresponding cart item info given product id and product data
     * @param {*} productId 
     * @param {*} productData 
     */
    const updateProductInCart = async (productId, productData) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => item.productId === productId ?
                {
                    ...item, productName: productData.productName, imageUrl: productData.imageUrl,
                    price: productData.price, productSku: productData.productSku, stock: productData.stock
                }
                : item))
    }

    /**
     * This function will delete cart item from users cart.
     * @param {*} cartItemId 
     */
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
            throw err
        }
    }

    /**
     * This function is called to remove a deleted product from the user's cart
     * @param {*} productId 
     * @returns 
     */
    const removeDeletedProductFromCart = (productId) => setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId))

    /**
     * This function will handle adding products to the user's cart.
     * @param {*} product 
     */
    const addToCart = async (product) => {

        try {
            previousCartItems.current = cartItems
            // add product to cart in backend            
            const response = await axiosInstance.post('/cart/item', { productId: product.productId, quantity: 1 })
            const addedProduct = response.data
            // Build cart item using returned product data
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
            throw err
        }
    }

    /**
     * This function will call the backend and generate a stripe url for checkout.
     */
    const onCheckout = async () => {
        try {
            const response = await axiosInstance.post('/checkout')
            if (response.data.url) {
                window.location.href = response.data.url
            }
        } catch (err) {
            console.error('Error ', err)
            throw err
        }
    }

    /**
     * Remove all cart items
     */
    const resetCart = () => {
        setCartItems([])
    }

    // Used to display number of items in cart
    const totalCartQuantity = cartItems.reduce((currQuant, currentItem) => currQuant + currentItem.quantity, 0)

    // Used to calculate total cost of items.
    const calculateCartItemTotal = () => {
        const total = cartItems.reduce((currTotal, currentItem) => currTotal + (currentItem.quantity * currentItem.price), 0)
        return displayCurrency(total)
    }

    return (
        <CartContext.Provider value={{ cartItems, updateCartItemQuantity, deleteFromCart, onCheckout, addToCart, removeDeletedProductFromCart, updateProductInCart, resetCart, totalCartQuantity, calculateCartItemTotal }}>
            {children}
        </CartContext.Provider>
    )
}


export const useCart = () => useContext(CartContext)