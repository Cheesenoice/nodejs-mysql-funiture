const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, cartController.getCart); // Thêm authMiddleware
router.post("/", authMiddleware, cartController.addToCart);
router.patch("/:item_id", authMiddleware, cartController.updateCartItem); // Thêm authMiddleware
router.delete("/:item_id", authMiddleware, cartController.removeFromCart); // Thêm authMiddleware

module.exports = router;
