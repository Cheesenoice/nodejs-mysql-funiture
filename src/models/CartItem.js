const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Cart = require("./Cart");
const Product = require("./Product");

const CartItem = sequelize.define(
  "CartItem",
  {
    cart_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cart_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "Cart_Items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

CartItem.belongsTo(Cart, { foreignKey: "cart_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });
Cart.hasMany(CartItem, { foreignKey: "cart_id" });

module.exports = CartItem;
