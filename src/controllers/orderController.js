const orderService = require("../services/orderService");
const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id || null; // Lấy từ JWT hoặc null
    const sessionId = userId ? null : req.sessionID; // Chỉ dùng session nếu không có userId
    const result = await orderService.createOrderFromCart(
      userId,
      sessionId,
      req.body
    );
    if (result.payUrl) {
      res.json({ success: true, data: result.order, payUrl: result.payUrl });
    } else {
      res.status(201).json({ success: true, data: result.order });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const orders = await orderService.getOrders(userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const order = await orderService.getOrderById(userId, req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const momoCallback = async (req, res) => {
  const { orderId, resultCode } = req.query;
  const order = await Order.findOne({ where: { momo_order_id: orderId } });
  if (!order)
    return res.status(404).json({ success: false, message: "Order not found" });

  const frontendBaseUrl = "http://localhost:3000";
  if (resultCode === "0") {
    await order.update({ payment_status: "paid" });
    res.redirect(`${frontendBaseUrl}/thank-you?orderId=${orderId}`);
  } else {
    await order.update({ payment_status: "failed" });
    res.redirect(`${frontendBaseUrl}/payment-failed?orderId=${orderId}`);
  }
};

module.exports = { createOrder, getOrders, getOrderById, momoCallback };
