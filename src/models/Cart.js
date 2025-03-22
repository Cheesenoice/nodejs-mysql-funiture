const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Cart = sequelize.define(
  "Cart",
  {
    cart_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    session_id: { type: DataTypes.STRING(100), allowNull: true },
  },
  {
    tableName: "Cart",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Cart.belongsTo(User, { foreignKey: "user_id" });
module.exports = Cart;
