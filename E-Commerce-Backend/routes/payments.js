const express = require("express");
const router = express.Router();

const { stripeWebhook } = require("../controllers/payments");

router.route("/webhook").post(stripeWebhook)


module.exports = router;