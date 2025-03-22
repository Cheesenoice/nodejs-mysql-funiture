const Category = require("../models/Category");
const Product = require("../models/Product");

const getAllCategories = async () => {
  const categories = await Category.findAll();
  const buildTree = (parentId = null) => {
    return categories
      .filter((cat) => cat.parent_id === parentId)
      .map((cat) => ({
        category_id: cat.category_id,
        name: cat.name,
        description: cat.description,
        subcategories: buildTree(cat.category_id),
      }));
  };
  return buildTree();
};

const createCategory = async (data) => {
  const { name, description, parent_id } = data;
  return await Category.create({ name, description, parent_id });
};

const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");
  await category.update(data);
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");

  // Kiểm tra danh mục con
  const subCategories = await Category.findAll({ where: { parent_id: id } });
  if (subCategories.length > 0)
    throw new Error("Cannot delete category with subcategories");

  // Kiểm tra sản phẩm
  const products = await Product.findAll({ where: { category_id: id } });
  if (products.length > 0)
    throw new Error("Cannot delete category with products");

  await category.destroy();
  return "Category deleted";
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
