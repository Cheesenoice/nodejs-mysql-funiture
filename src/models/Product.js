const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./Category");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    color: { type: DataTypes.STRING(50) },
    material: { type: DataTypes.STRING(50) },
    size: { type: DataTypes.STRING(50) },
    is_new: { type: DataTypes.BOOLEAN, defaultValue: false },
    brand: { type: DataTypes.STRING(100) },
    image0: { type: DataTypes.STRING(255) },
    image1: { type: DataTypes.STRING(255) },
    image2: { type: DataTypes.STRING(255) },
    image3: { type: DataTypes.STRING(255) },
    image4: { type: DataTypes.STRING(255) },
    image5: { type: DataTypes.STRING(255) },
  },
  {
    tableName: "Products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Product.belongsTo(Category, { foreignKey: "category_id" });

module.exports = Product;
