const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("Stripe webhook received (placeholder)");
  res.json({ received: true });
});

module.exports = router;
