const express = require("express");
const router = express.Router();

const { stripeWebhook } = require("../controllers/payments");

// This route is for stripe to call when successful payments are made.
router.route("/webhook").post(stripeWebhook)


module.exports = router;