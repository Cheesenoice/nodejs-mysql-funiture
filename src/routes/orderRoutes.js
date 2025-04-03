const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, orderController.getOrdersByUser);
router.post("/", authMiddleware, orderController.createOrder);
router.get("/callback", orderController.momoCallback);
router.get("/:id", orderController.getOrderById);

module.exports = router;
