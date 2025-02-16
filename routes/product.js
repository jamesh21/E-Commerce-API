const express = require("express");
const router = express.Router();
const {
    getProduct, addProduct, updateProduct, deleteProduct, getProducts }
    = require("../controllers/product");

router.route("/:sku").get(getProduct).put(updateProduct).delete(deleteProduct);
router.route('/').post(addProduct).get(getProducts)

module.exports = router;