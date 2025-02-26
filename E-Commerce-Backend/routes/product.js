const express = require("express");
const router = express.Router();
const adminMiddleware = require('../middleware/admin')
const authMiddleware = require('../middleware/authentication')
const {
    getProduct, addProduct, updateProduct, deleteProduct, getProducts }
    = require("../controllers/product");

router.route("/:sku").get(getProduct)
router.route('/').get(getProducts)

router.use(authMiddleware)
// below routes need admin privledge
// router.use(adminMiddleware)
router.route("/:sku").put(updateProduct).delete(deleteProduct);
router.route('/').post(addProduct)


module.exports = router;