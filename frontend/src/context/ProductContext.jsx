import { createContext, useState, useContext, useEffect, useRef } from 'react';
import axiosInstance from '../services/axios'
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([])

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

    const addProduct = async (productData) => {
        try {
            const response = await axiosInstance.post('/product', productData)
            const responseData = response.data
            console.log(responseData)
            setProducts([...products, { ...responseData }])
        } catch (error) {
            console.error(error)
        }
    }
    const updateProduct = async (productId, updates) => {
        try {
            const response = await axiosInstance.put(`/product/${productId}`, updates)
            const responseData = response.data

            setProducts((prevItems) =>
                prevItems.map((item) => item.productId === productId ? { ...responseData } : item)
            )
        } catch (err) {
            console.error(err)
        }
    }

    const deleteProduct = async (productId) => {
        try {
            const response = await axiosInstance.delete(`/product/${productId}`)
            // const responseData = response.data
            setProducts((prevItems) => prevItems.filter((item) => item.productId !== productId))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <ProductContext.Provider value={{ products, updateProduct, deleteProduct, addProduct }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProduct = () => useContext(ProductContext)