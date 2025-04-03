const Order = require("../models/Order");
const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = userId ? null : req.sessionID;
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

const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user?.id; // Lấy từ JWT qua authMiddleware
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const orders = await orderService.getOrdersByUser(userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(error.message === "Order not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

const momoCallback = async (req, res) => {
  console.log("MoMo Callback triggered at:", new Date().toISOString());
  console.log("Callback query:", req.query);

  const { orderId: momoOrderId, resultCode } = req.query;
  const order = await Order.findOne({ where: { momo_order_id: momoOrderId } });
  if (!order) {
    console.log("Order not found for momo_order_id:", momoOrderId);
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  console.log("Order found:", order.toJSON());
  const frontendBaseUrl = "http://localhost:3000";
  if (resultCode === "0") {
    await order.update({ payment_status: "paid" });
    res.redirect(`${frontendBaseUrl}/thank-you`);
  } else {
    await order.update({ payment_status: "failed" });
    res.redirect(`${frontendBaseUrl}/payment-failed`);
  }
};

module.exports = { createOrder, momoCallback, getOrdersByUser, getOrderById };
