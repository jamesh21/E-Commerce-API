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
    return (
        <ProductContext.Provider value={{ products }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProduct = () => useContext(ProductContext)