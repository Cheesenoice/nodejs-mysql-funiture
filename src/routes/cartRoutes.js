const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.patch("/:item_id", cartController.updateCartItem);
router.delete("/:item_id", cartController.removeFromCart);

module.exports = router;
