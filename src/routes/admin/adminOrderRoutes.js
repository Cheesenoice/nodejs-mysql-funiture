const express = require("express");
const router = express.Router();
const adminOrderController = require("../../controllers/admin/adminOrderController");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  adminOrderController.getAllOrders
);
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  adminOrderController.getOrderById
);
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  adminOrderController.updateOrder
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  adminOrderController.deleteOrder
);

module.exports = router;
