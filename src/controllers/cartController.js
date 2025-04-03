const cartService = require("../services/cartService");

const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || null; // Từ JWT hoặc null
    const sessionId = userId ? null : req.sessionID; // Chỉ dùng session nếu không có userId
    const cart = await cartService.getCart(userId, sessionId);
    const itemCount = await cartService.countCartItems(userId, sessionId);
    res.json({
      success: true,
      data: cart || { cart_id: null, user_id: null, items: [] },
      itemCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = userId ? null : req.sessionID;
    const cartItem = await cartService.addToCart(
      userId,
      sessionId,
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
    const userId = req.user?.id || null;
    const sessionId = userId ? null : req.sessionID;
    const cartItem = await cartService.updateCartItem(
      userId,
      sessionId,
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
    const userId = req.user?.id || null;
    const sessionId = userId ? null : req.sessionID;
    const message = await cartService.removeFromCart(
      userId,
      sessionId,
      req.params.item_id
    );
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
