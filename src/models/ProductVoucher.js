const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Voucher = require("./Voucher");
const Product = require("./Product");

const ProductVoucher = sequelize.define(
  "ProductVoucher",
  {
    product_voucher_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Products_Vouchers",
    timestamps: false,
    indexes: [{ unique: true, fields: ["voucher_id", "product_id"] }],
  }
);

Voucher.hasMany(ProductVoucher, { foreignKey: "voucher_id" });
ProductVoucher.belongsTo(Voucher, { foreignKey: "voucher_id" });
Product.hasMany(ProductVoucher, { foreignKey: "product_id" });
ProductVoucher.belongsTo(Product, { foreignKey: "product_id" });

module.exports = ProductVoucher;
