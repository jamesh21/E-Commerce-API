
const apiToJSMapping = {
    cart_item_id: "cartItemId",
    cart_id: "cartId",
    product_id: "productId",
    product_name: "productName",
    product_sku: "productSku",
    image_url: "imageUrl"
}

const formatApiFields = (apiData) => {

    const formattedData = []
    apiData.map((entry) => {
        const newFormattedEntry = {}
        for (const [apiField, value] of Object.entries(entry)) {
            if (apiField in apiToJSMapping) { // Need to format field
                newFormattedEntry[apiToJSMapping[apiField]] = value
            } else {
                newFormattedEntry[apiField] = value
            }
        }
        formattedData.push(newFormattedEntry)

    })
    return formattedData
}

export default formatApiFields