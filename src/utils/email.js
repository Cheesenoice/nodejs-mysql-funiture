const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (to, token) => {
  const resetLink = `http://localhost:3000/api/auth/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Reset Password",
    text: `Click this link to reset your password: ${resetLink}`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
