const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/stripeController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

router.post(
  "/create-checkout-session",
  authenticate,
  authorize("CUSTOMER"),
  createCheckoutSession,
);

module.exports = router;
