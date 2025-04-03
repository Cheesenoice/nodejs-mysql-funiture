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

  const momoOrderId = `ORDER_${Date.now()}`; // momo_order_id riêng biệt
  console.log("Creating order with momo_order_id:", momoOrderId);
  const order = await Order.create({
    user_id: userId,
    session_id: userId ? null : sessionId,
    full_name,
    email,
    phone,
    address,
    total_amount: totalAmount,
    payment_method: payment_method || "cod",
    momo_order_id: payment_method === "momo" ? momoOrderId : null,
  });
  console.log("Order created:", order.toJSON());

  await OrderItem.bulkCreate(
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
    const callbackUrl = process.env.CALLBACK_URL;
    const payUrl = await momoPayment(
      momoOrderId,
      totalAmount.toString(),
      `${callbackUrl}/api/orders/callback`,
      `${callbackUrl}/api/orders/callback`
    );
    console.log("MoMo payUrl:", payUrl);
    return { order, payUrl };
  }

  return { order };
};

const getOrdersByUser = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  const orders = await Order.findAll({
    where: { user_id: userId },
    attributes: [
      "order_id",
      "user_id",
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
          { model: Product, attributes: ["product_id", "name", "price"] },
        ],
      },
    ],
  });
  return orders;
};

const getOrderById = async (orderId) => {
  const order = await Order.findOne({
    where: { order_id: orderId },
    attributes: [
      "order_id",
      "user_id",
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
          { model: Product, attributes: ["product_id", "name", "price"] },
        ],
      },
    ],
  });
  if (!order) throw new Error("Order not found");
  return order;
};

const getAllOrders = async () => {
  const orders = await Order.findAll({
    attributes: [
      "order_id",
      "user_id",
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
          { model: Product, attributes: ["product_id", "name", "price"] },
        ],
      },
    ],
  });
  return orders;
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
  getOrdersByUser,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
