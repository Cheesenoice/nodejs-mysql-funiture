const User = require("../models/User");

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] }, // Loại bỏ password
  });
  if (!user) throw new Error("User not found");
  return user;
};

const updateUserProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");
  await user.update(data);
  return user;
};

module.exports = { getUserProfile, updateUserProfile };
