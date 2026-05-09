const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

router.get("/", reviewController.getByProduct);
router.post("/", authenticate, authorize("CUSTOMER"), reviewController.create);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  reviewController.remove,
);

module.exports = router;
