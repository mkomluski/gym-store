const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  asyncHandler(orderController.create),
);
router.get(
  "/my-orders",
  authenticate,
  authorize("CUSTOMER", "ADMIN"),
  asyncHandler(orderController.getMyOrders),
);
router.get(
  "/my-orders/:id",
  authenticate,
  authorize("CUSTOMER"),
  asyncHandler(orderController.getMyOrder),
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(orderController.getAll),
);
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(orderController.getOne),
);
router.post(
  "/:id/cancel",
  authenticate,
  authorize("CUSTOMER"),
  asyncHandler(orderController.cancel),
);
router.put(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(orderController.updateStatus),
);

module.exports = router;
