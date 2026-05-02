const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

router.get("/", asyncHandler(productController.getAll));
router.get("/:id", asyncHandler(productController.getOne));

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(productController.create),
);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(productController.update),
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(productController.remove),
);

module.exports = router;
