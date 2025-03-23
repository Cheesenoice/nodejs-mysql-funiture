const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const { momoPayment } = require("./paymentService");
const { sendOrderConfirmation } = require("./emailService");

const createOrderFromCart = async (
  userId,
  sessionId,
  { full_name, email, phone, address, payment_method }
) => {
  const cart = await Cart.findOne({
    where: userId ? { user_id: userId } : { session_id: sessionId },
    include: [CartItem],
  });
  if (!cart || !cart.CartItems.length) throw new Error("Cart is empty");

  let totalAmount = 0;
  const orderItems = [];
  for (const item of cart.CartItems) {
    const product = await Product.findByPk(item.product_id);
    if (!product || product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for product ${product?.name || item.product_id}`
      );
    }
    totalAmount += product.price * item.quantity;
    orderItems.push({
      product_id: item.product_id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const orderId = `ORDER_${Date.now()}`;
  const order = await Order.create({
    user_id: userId || null,
    full_name,
    email,
    phone,
    address,
    total_amount: totalAmount,
    payment_method: payment_method || "cod",
    momo_order_id: payment_method === "momo" ? orderId : null,
  });

  const createdOrderItems = await OrderItem.bulkCreate(
    orderItems.map((item) => ({
      order_id: order.order_id,
      ...item,
    }))
  );

  for (const item of orderItems) {
    const product = await Product.findByPk(item.product_id);
    product.stock -= item.quantity;
    await product.save();
  }

  await CartItem.destroy({ where: { cart_id: cart.cart_id } });
  await cart.destroy();

  const itemsWithProduct = await OrderItem.findAll({
    where: { order_id: order.order_id },
    include: [{ model: Product, attributes: ["name", "price"] }],
  });
  await sendOrderConfirmation(email, order, itemsWithProduct);

  if (order.payment_method === "momo") {
    const callbackUrl = process.env.CALLBACK_URL; // Sử dụng biến từ .env
    const payUrl = await momoPayment(
      orderId,
      totalAmount.toString(),
      `${callbackUrl}/api/orders/callback`,
      `${callbackUrl}/api/orders/callback`
    );
    return { order, payUrl };
  }

  return { order };
};

const getOrders = async (userId) => {
  const where = userId ? { user_id: userId } : {};
  return await Order.findAll({
    where,
    include: [
      {
        model: OrderItem,
        attributes: ["order_item_id", "product_id", "quantity", "price"],
      },
    ],
    attributes: [
      "order_id",
      "full_name",
      "email",
      "phone",
      "address",
      "total_amount",
      "status",
      "payment_method",
      "payment_status",
      "created_at",
    ],
  });
};

const getOrderById = async (userId, orderId) => {
  const where = userId
    ? { order_id: orderId, user_id: userId }
    : { order_id: orderId };
  const order = await Order.findOne({
    where,
    attributes: [
      "order_id",
      "full_name",
      "email",
      "phone",
      "address",
      "total_amount",
      "status",
      "payment_method",
      "payment_status",
      "created_at",
    ],
    include: [
      {
        model: OrderItem,
        attributes: ["order_item_id", "product_id", "quantity", "price"],
        include: [
          {
            model: Product,
            attributes: ["product_id", "name", "price"],
          },
        ],
      },
    ],
  });
  if (!order) throw new Error("Order not found");
  return order;
};

const getAllOrders = async () => {
  return await Order.findAll({
    include: [
      {
        model: OrderItem,
        attributes: ["order_item_id", "product_id", "quantity", "price"],
      },
    ],
    attributes: [
      "order_id",
      "full_name",
      "email",
      "phone",
      "address",
      "total_amount",
      "status",
      "payment_method",
      "payment_status",
      "created_at",
    ],
  });
};

const updateOrder = async (orderId, data) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error("Order not found");
  await order.update(data);
  return order;
};

const deleteOrder = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error("Order not found");
  await OrderItem.destroy({ where: { order_id: orderId } });
  await order.destroy();
  return "Order deleted";
};

module.exports = {
  createOrderFromCart,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
