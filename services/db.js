const pool = require('../db'); // Import the database connection
const { ConflictError, NotFoundError } = require('../errors')

// User Table query start here
const addUserToDB = async (email, hashedPassword, name, admin) => {
    const user = await pool.query('INSERT INTO users (email_address, password_hash, full_name, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, hashedPassword, name, admin]
    )
    return user
}

const getUserFromDB = async (email) => {
    const user = await pool.query('SELECT * FROM users WHERE email_address = ($1)', [email])
    return user
}

// Cart Table query start here
const addCartToDB = async (userId) => {
    const newCart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId])
    return newCart
}

const getCartFromDB = async (userId) => {
    const cart = await pool.query('SELECT cart_id FROM carts WHERE user_id = ($1)', [userId])
    return cart
}

// Product Table query start here
const getProductFromDB = async (sku) => {
    const product = await pool.query('SELECT product_sku, product_name, price, quantity FROM products WHERE product_sku = ($1)',
        [sku])
    if (product.rowCount === 0) {
        throw new NotFoundError('Product sku was not found')
    }
    return product
}

const getProductsFromDB = async () => {
    const allProducts = await pool.query('SELECT * FROM products')
    return allProducts
}

const addProductToDB = async (productName, quantity, price, productSku) => {
    try {
        const newProduct = await pool.query('INSERT INTO products (product_name, quantity, price, product_sku) VALUES ($1, $2, $3, $4) RETURNING *',
            [productName, quantity, price, productSku])
        return newProduct.rows[0]
    } catch (err) {
        if (err.code === '23505') {
            throw new ConflictError('Product Sku has to be unique')
        }
        throw err
    }
}

const updateProductInDB = async (sku, fieldsToUpdate) => {
    const setStatements = [], values = []
    let i = 1
    // building array of fields to update, since it could be a partial update
    for (const [field, value] of Object.entries(fieldsToUpdate)) {
        setStatements.push(`${field} = $${i}`)
        values.push(value)
        i++
    }
    values.push(sku)
    const query = `UPDATE products SET ${setStatements.join(',')} WHERE product_sku = $${i} RETURNING *`
    try {
        const updatedProduct = await pool.query(query, values)

        return updatedProduct.rows[0]
    } catch (err) {
        // duplicate entry
        if (err.code === '23505') {
            throw new ConflictError('Product Sku has to be unique')
        }
        throw err
    }
}

const deleteProductInDB = async (sku) => {
    const product = await pool.query('DELETE FROM products WHERE product_sku = ($1)', [sku])
    if (product.rowCount === 0) {
        throw new NotFoundError('Product sku was not found')
    }
}

// Cart Item Table query start here
const getCartItemsFromDB = async (cartId) => {
    const cartItems = await pool.query('SELECT ci.cart_item_id, p.product_sku, p.product_name, p.price, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id=p.product_id WHERE ci.cart_id=($1)', [cartId])
    return { data: cartItems.rows, count: cartItems.rowCount }
}


const addCartItemToDB = async (cartId, productId, quantity) => {
    try {
        // attemps to add item to cart, if already present increment quantity instead.
        const cartItem = await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity RETURNING *'
            , [cartId, productId, quantity])
        return cartItem.rows[0]
    } catch (err) {
        if (err.code === '23503') {
            throw new NotFoundError('product does not exist')
        }
        throw err
    }
}

const updateCartItemQuantityInDB = async (quantity, cartItemId, cartId) => {
    const cartItem = await pool.query('UPDATE cart_items SET quantity = ($1) WHERE cart_item_id = ($2) AND cart_id = ($3) RETURNING *', [quantity, cartItemId, cartId])
    if (cartItem.rowCount === 0) {
        throw new NotFoundError('cart item passed in was not found')
    }
    return cartItem.rows[0]
}

const removeCartItemFromDB = async (cartItemId, cartId) => {
    const cartItem = await pool.query('DELETE FROM cart_items WHERE cart_item_id = ($1) AND cart_id = ($2)', [cartItemId, cartId])
    if (cartItem.rowCount === 0) {
        throw new NotFoundError('cart item was not found')
    }
    return { msg: `Deleted cart item ${cartItemId} successfully` }
}

const clearCartItemForUserInDB = async (cartId) => {
    await pool.query('DELETE FROM cart_items WHERE cart_id = ($1)', [cartId])
    return { msg: 'Cart has been cleared' }
}

// Order Table query start here
const createOrderInDB = async (userId, totalPrice) => {
    const order = await pool.query('INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *', [userId, totalPrice])
    return order.rows[0].order_id
}


module.exports = {
    getProductFromDB, getProductsFromDB, addProductToDB, updateProductInDB, deleteProductInDB,
    addUserToDB, getUserFromDB, getCartItemsFromDB, createOrderInDB, addCartToDB, getCartFromDB,
    addCartItemToDB, updateCartItemQuantityInDB, removeCartItemFromDB, clearCartItemForUserInDB
}