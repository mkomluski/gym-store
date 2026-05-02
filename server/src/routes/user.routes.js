const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

router.get("/me", authenticate, asyncHandler(userController.getMe));
router.put("/me", authenticate, asyncHandler(userController.updateMe));

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(userController.getAll),
);
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(userController.getOne),
);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(userController.update),
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(userController.remove),
);

module.exports = router;
