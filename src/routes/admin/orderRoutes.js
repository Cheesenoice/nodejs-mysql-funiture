const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/admin/orderController");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.get("/", authMiddleware, adminMiddleware, orderController.getAllOrders);
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  orderController.getOrderById
);
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrder
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  orderController.deleteOrder
);

module.exports = router;
