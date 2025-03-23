const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

const getCart = async (userId, sessionId) => {
  const cart = await Cart.findOne({
    where: userId ? { user_id: userId } : { session_id: sessionId },
    attributes: ["cart_id", "session_id", "created_at"],
    include: [
      {
        model: CartItem,
        attributes: ["cart_item_id", "product_id", "quantity"],
        include: [
          {
            model: Product,
            attributes: ["product_id", "name", "price", "image1"],
          },
        ],
      },
    ],
  });
  if (!cart) return { items: [], total_quantity: 0 };

  const totalQuantity = cart.CartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  return {
    cart_id: cart.cart_id,
    session_id: cart.session_id,
    created_at: cart.created_at,
    items: cart.CartItems,
    total_quantity: totalQuantity,
  };
};

const addToCart = async (userId, sessionId, productId, quantity) => {
  const product = await Product.findByPk(productId);
  if (!product || product.stock < quantity)
    throw new Error(`Only ${product?.stock || 0} items available`);

  let cart = await Cart.findOne({
    where: userId ? { user_id: userId } : { session_id: sessionId },
  });
  if (!cart) {
    cart = await Cart.create(
      userId ? { user_id: userId } : { session_id: sessionId }
    );
  }

  let cartItem = await CartItem.findOne({
    where: { cart_id: cart.cart_id, product_id: productId },
  });
  if (cartItem) {
    const newQuantity = cartItem.quantity + quantity;
    if (product.stock < newQuantity)
      throw new Error(`Only ${product.stock} items available`);
    cartItem.quantity = newQuantity;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      cart_id: cart.cart_id,
      product_id: productId,
      quantity,
    });
  }
  return cartItem;
};

const updateCartItem = async (userId, sessionId, itemId, quantity) => {
  const cart = await Cart.findOne({
    where: userId ? { user_id: userId } : { session_id: sessionId },
  });
  if (!cart) throw new Error("Cart not found");

  const cartItem = await CartItem.findOne({
    where: { cart_item_id: itemId, cart_id: cart.cart_id },
  });
  if (!cartItem) throw new Error("Cart item not found");

  const product = await Product.findByPk(cartItem.product_id);
  if (product.stock < quantity)
    throw new Error(`Only ${product.stock} items available`);

  cartItem.quantity = quantity;
  await cartItem.save();
  return cartItem;
};

const removeFromCart = async (userId, sessionId, itemId) => {
  const cart = await Cart.findOne({
    where: userId ? { user_id: userId } : { session_id: sessionId },
  });
  if (!cart) throw new Error("Cart not found");

  const cartItem = await CartItem.findOne({
    where: { cart_item_id: itemId, cart_id: cart.cart_id },
  });
  if (!cartItem) throw new Error("Cart item not found");

  await cartItem.destroy();
  return "Item removed";
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
