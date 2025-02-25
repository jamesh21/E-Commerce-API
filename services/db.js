const pool = require('../db'); // Import the database connection
const { ConflictError, NotFoundError, BadRequestError } = require('../errors')

// User Table query start here
const addUserToDB = async (email, hashedPassword, name, admin) => {
    try {
        const user = await pool.query('INSERT INTO users (email_address, password_hash, full_name, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, hashedPassword, name, admin]
        )
        if (user.rows.length === 0) {
            throw new Error('User could not be created, try again later')
        }
        return user.rows[0]
    } catch (err) {
        // duplicate entry
        if (err.code === '23505') {
            throw new ConflictError('email already exists')
        }
        throw err
    }
}

const getUserFromDB = async (email) => {
    const user = await pool.query('SELECT * FROM users WHERE email_address = ($1)', [email])
    if (user.rowCount === 0) {
        throw new NotFoundError('User was not found')
    }
    return user.rows[0]
}

// Cart Table query start here
const addCartToDB = async (userId) => {
    const newCart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId])
    if (newCart.rowCount === 0) {
        throw new Error('Cart could not be created, try again later')
    }
    return newCart.rows[0]
}

const getCartFromDB = async (userId) => {
    const cart = await pool.query('SELECT cart_id FROM carts WHERE user_id = ($1)', [userId])
    if (cart.rowCount > 0) {
        return cart.rows[0]
    }
}

// Product Table query start here
const getProductFromDB = async (sku) => {
    const product = await pool.query('SELECT product_sku, product_name, price, stock FROM products WHERE product_sku = ($1)',
        [sku])
    if (product.rowCount === 0) {
        throw new NotFoundError('Product sku was not found')
    }
    return { data: product.rows, count: product.rowCount }
}

const getProductsFromDB = async () => {
    const allProducts = await pool.query('SELECT * FROM products')

    return { data: allProducts.rows, count: allProducts.rowCount }
}

const addProductToDB = async (productName, quantity, price, productSku) => {
    try {
        const newProduct = await pool.query('INSERT INTO products (product_name, stock, price, product_sku) VALUES ($1, $2, $3, $4) RETURNING *',
            [productName, quantity, price, productSku])
        if (newProduct.rowCount === 0) {
            throw new Error('Product could not be created, try again later')
        }
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
        if (updatedProduct.rowCount === 0) {
            throw new Error('Could not updated product, try again later')
        }
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
    const cartItems = await pool.query('SELECT ci.cart_item_id, p.product_id, p.product_sku, p.product_name, p.price, p.stock, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id=p.product_id WHERE ci.cart_id=($1)', [cartId])

    return { data: cartItems.rows, count: cartItems.rowCount }
}


const addCartItemToDB = async (cartId, productId, quantity) => {
    try {
        // attemps to add item to cart, if already present increment quantity instead.
        const cartItem = await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity RETURNING *'
            , [cartId, productId, quantity])
        if (cartItem.rowCount === 0) {
            throw new Error('Could not add cart item to db, try again later')
        }
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
    if (order.rowCount === 0) {
        throw new Error('Order could not be created, try again later')
    }
    return order.rows[0].order_id
}

const addOrderLineItemToDB = async (item, orderId) => {
    await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', [orderId, item.product_id, item.quantity, item.price])
}

const createOrder = async (cartId, userId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN')
        // Retrieve all items from user's cart
        const { data: cartItems } = await getCartItemsFromDB(cartId)

        // Get total cost of items
        let total = 0
        for (let cartItem of cartItems) {
            // Need to check if product inventory is enough to fufill
            if (cartItem.quantity > cartItem.stock) {
                throw new BadRequestError(`Not enough stock for product ${cartItem.product_sku}`)
            }
            cartItem['total'] = cartItem.price * cartItem.quantity
            total += cartItem['total']
        }
        // Create an order, in DB
        const orderId = await createOrderInDB(userId, total)
        // Add order line items and reduce inventory in product table
        for (let cartItem of cartItems) {
            await addOrderLineItemToDB(cartItem, orderId)
            await updateProductInDB(cartItem.product_sku, { quantity: cartItem.stock - cartItem.quantity })
        }
        await client.query('COMMIT')

        return cartItems
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}

module.exports = {
    getProductFromDB, getProductsFromDB, addProductToDB, updateProductInDB, deleteProductInDB,
    addUserToDB, getUserFromDB, getCartItemsFromDB, createOrderInDB, addCartToDB, getCartFromDB,
    addCartItemToDB, updateCartItemQuantityInDB, removeCartItemFromDB, clearCartItemForUserInDB,
    addOrderLineItemToDB, createOrder
}