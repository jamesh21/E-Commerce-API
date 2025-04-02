import { createContext, useState, useContext, useEffect, useRef } from 'react';
import axiosInstance from '../services/axios'
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([])

    /**
     * Fetches product list from backend
     */
    useEffect(() => {
        const fetchedProducts = async () => {
            try {
                const response = await axiosInstance.get('/product')
                const responseData = response.data
                setProducts(responseData.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchedProducts()
    }, [])

    /**
     * Adds new product backend and set new product in state
     * @param {*} productData 
     */
    const addProduct = async (productData) => {
        try {
            const response = await axiosInstance.post('/product', productData)
            const responseData = response.data

            setProducts([...products, { ...responseData }])
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    /**
     * Updates product info
     * @param {*} productId 
     * @param {*} updates 
     */
    const updateProduct = async (productId, updates) => {
        try {
            const response = await axiosInstance.put(`/product/${productId}`, updates)
            const responseData = response.data

            setProducts((prevItems) =>
                prevItems.map((item) => item.productId === productId ? { ...responseData } : item)
            )
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    /**
     * Deletes product from backend and removes it from product list.
     * @param {*} productId 
     */
    const deleteProduct = async (productId) => {
        try {
            await axiosInstance.delete(`/product/${productId}`)

            setProducts((prevItems) => prevItems.filter((item) => item.productId !== productId))
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    return (
        <ProductContext.Provider value={{ products, updateProduct, deleteProduct, addProduct }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProduct = () => useContext(ProductContext)