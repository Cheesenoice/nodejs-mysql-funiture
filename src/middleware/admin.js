const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" }); // Ngắn gọn
  }
  next();
};

module.exports = adminMiddleware;
