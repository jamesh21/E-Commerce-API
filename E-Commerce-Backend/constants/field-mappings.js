// Mapping for db values to values used in backend code
const DB_TO_API_MAPPING = {
    cart_item_id: "cartItemId",
    cart_id: "cartId",
    product_id: "productId",
    product_name: "productName",
    product_sku: "productSku",
    image_url: "imageUrl",
    email_address: "email",
    full_name: "name",
    is_admin: "isAdmin",
    user_id: "userId",
    password_hash: "password"
}

// Mapping for backend code to db values.
const API_TO_DB_MAPPING = {
    productName: 'product_name',
    imageUrl: 'image_url',
    productSku: 'product_sku',
    userId: 'user_id',
    email: 'email_address',
    name: 'full_name',
    isAdmin: 'is_admin',
    password: 'password_hash'
}

module.exports = { DB_TO_API_MAPPING, API_TO_DB_MAPPING }