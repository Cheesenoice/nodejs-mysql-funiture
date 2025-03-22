const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../utils/email");

const register = async ({
  username,
  password,
  email,
  full_name,
  phone,
  address,
}) => {
  // Kiểm tra trùng lặp
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) throw new Error("Email already exists");

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) throw new Error("Username already exists");

  const existingPhone = phone ? await User.findOne({ where: { phone } }) : null;
  if (existingPhone) throw new Error("Phone number already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    full_name,
    phone,
    address,
  });
  return { user_id: user.user_id, username: user.username, email: user.email };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Email not found");
  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return {
    token,
    user: { user_id: user.user_id, username: user.username, role: user.role },
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Email not found");
  const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  await sendResetEmail(email, token);
  return "Reset link sent to your email";
};

const resetPassword = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
  const user = await User.findByPk(decoded.id);
  if (!user) throw new Error("User not found");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });
  return "Password reset successfully";
};

module.exports = { register, login, forgotPassword, resetPassword };
