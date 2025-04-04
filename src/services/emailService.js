const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Thêm vào .env
    pass: process.env.EMAIL_PASS, // Thêm vào .env (dùng App Password nếu Gmail)
  },
});

const sendOrderConfirmation = async (to, order, orderItems) => {
  const itemsList = orderItems
    .map((item) => `${item.Product.name} × ${item.quantity} - ${item.price}₫`)
    .join("\n");
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Đơn hàng #${order.order_id} - Cảm ơn bạn đã mua hàng!`,
    text: `
      Xin chào ${order.full_name},

      Chúng tôi đã nhận được đơn hàng #${
        order.order_id
      } của bạn và đang chuẩn bị giao hàng. Bạn sẽ nhận được thông báo khi đơn hàng được gửi đi.

      **Thông tin đơn hàng:**
      ${itemsList}

      Tổng tiền hàng: ${order.total_amount}\nGiảm giá: ${
      order.discount_amount
    }\nThành tiền: ${order.final_amount} VND
      Phương thức thanh toán: ${
        order.payment_method === "cod"
          ? "Thanh toán khi nhận hàng"
          : "Thanh toán qua MoMo"
      }

      **Địa chỉ giao hàng:**
      ${order.full_name}
      ${order.address}

      Nếu có câu hỏi, vui lòng liên hệ chúng tôi qua email này.

      Trân trọng,
      Cửa hàng Nội Thất
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendOrderCancellationEmail = async (to, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Order Cancellation",
    text: `Your order #${order.order_id} has been canceled.\nMoney will be refunded manually after 7 days.\nIf this was a mistake, please contact support.`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmation, sendOrderCancellationEmail };
