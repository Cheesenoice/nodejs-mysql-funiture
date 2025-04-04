const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./Order");
const Voucher = require("./Voucher");

const OrderVoucher = sequelize.define(
  "OrderVoucher",
  {
    order_voucher_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount_applied: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { tableName: "Order_Vouchers", timestamps: false }
);

Order.hasMany(OrderVoucher, { foreignKey: "order_id" });
OrderVoucher.belongsTo(Order, { foreignKey: "order_id" });
Voucher.hasMany(OrderVoucher, { foreignKey: "voucher_id" });
OrderVoucher.belongsTo(Voucher, { foreignKey: "voucher_id" });

module.exports = OrderVoucher;
