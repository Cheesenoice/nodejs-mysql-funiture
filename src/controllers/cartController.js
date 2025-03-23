const cartService = require("../services/cartService");

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user?.id, req.sessionID);
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const cartItem = await cartService.addToCart(
      req.user?.id,
      req.sessionID,
      req.body.product_id,
      req.body.quantity
    );
    res.status(201).json({ success: true, data: cartItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cartItem = await cartService.updateCartItem(
      req.user?.id,
      req.sessionID,
      req.params.item_id,
      req.body.quantity
    );
    res.json({ success: true, data: cartItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const message = await cartService.removeFromCart(
      req.user?.id,
      req.sessionID,
      req.params.item_id
    );
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
