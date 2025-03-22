const Product = require("../models/Product");
const Category = require("../models/Category");
const { uploadImage, deleteImage } = require("../utils/upload");

const createProduct = async (data, files) => {
  const {
    category_id,
    name,
    description,
    price,
    stock,
    is_featured,
    color,
    material,
    size,
    is_new,
    brand,
  } = data;
  const images = files
    ? await Promise.all(files.map((file) => uploadImage(file)))
    : [];

  const productData = {
    category_id,
    name,
    description,
    price,
    stock,
    is_featured,
    color,
    material,
    size,
    is_new,
    brand,
  };
  images.forEach((img, index) => {
    productData[`image${index + 1}`] = img.url;
  });

  return await Product.create(productData);
};

const getProducts = async ({ category_id, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  let categoryIds = [];

  if (category_id) {
    const getSubCategories = async (parentId) => {
      const subs = await Category.findAll({ where: { parent_id: parentId } });
      let ids = [parentId];
      for (const sub of subs) {
        ids = ids.concat(await getSubCategories(sub.category_id));
      }
      return ids;
    };
    categoryIds = await getSubCategories(parseInt(category_id));
  }

  const where = category_id ? { category_id: categoryIds } : {};
  const { count, rows } = await Product.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
  });

  return {
    products: rows,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count },
  };
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, as: "Category" }],
  });
  if (!product) throw new Error("Product not found");
  return product;
};

const updateProduct = async (id, data, files) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  const images = files
    ? await Promise.all(files.map((file) => uploadImage(file)))
    : [];
  const productData = { ...data };

  images.forEach((img, index) => {
    productData[`image${index + 1}`] = img.url;
  });

  await product.update(productData);
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");
  await product.destroy();
  return "Product deleted";
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
