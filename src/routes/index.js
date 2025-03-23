const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const adminCategoryRoutes = require("./admin/categoryRoutes");
const adminProductRoutes = require("./admin/productRoutes");
const adminOrderRoutes = require("./admin/orderRoutes");

module.exports = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/admin/categories", adminCategoryRoutes);
  app.use("/api/admin/products", adminProductRoutes);
  app.use("/api/admin/orders", adminOrderRoutes);
};
