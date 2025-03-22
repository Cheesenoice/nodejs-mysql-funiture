const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    parent_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "Categories",
    timestamps: true, // Bật timestamps để dùng updated_at
    createdAt: false, // Tắt createdAt
    updatedAt: "updated_at", // Chỉ dùng updated_at
  }
);

Category.belongsTo(Category, { as: "parent", foreignKey: "parent_id" });

module.exports = Category;
