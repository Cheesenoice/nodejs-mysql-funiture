const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Voucher = sequelize.define(
  "Voucher",
  {
    voucher_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    discount_type: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: false,
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    applicable_type: {
      type: DataTypes.ENUM("all", "product"),
      allowNull: false,
    },
    min_order_value: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    max_discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: null,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    max_usage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    used_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "Vouchers", timestamps: false }
);

module.exports = Voucher;
