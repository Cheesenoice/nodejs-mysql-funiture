const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING(50), allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "canceled"
      ),
      defaultValue: "pending",
    },
    payment_method: {
      type: DataTypes.ENUM("cod", "momo"),
      allowNull: false,
      defaultValue: "cod",
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      defaultValue: "pending",
    },
    momo_order_id: { type: DataTypes.STRING(50), unique: true }, // Thêm cột mới
  },
  {
    tableName: "Orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Order.belongsTo(User, { foreignKey: "user_id" });
module.exports = Order;
