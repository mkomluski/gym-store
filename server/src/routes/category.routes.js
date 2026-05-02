const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

router.get("/", asyncHandler(categoryController.getAll));
router.get("/:id", asyncHandler(categoryController.getOne));

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(categoryController.create),
);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(categoryController.update),
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(categoryController.remove),
);

module.exports = router;
