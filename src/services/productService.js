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
    productData[`image${index}`] = img.url; // Đổi thành image0 đến image5
  });

  return await Product.create(productData);
};

const getProducts = async ({
  category_id,
  is_featured,
  is_new,
  page = 1,
  limit = 10,
}) => {
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

  const where = {};
  if (category_id) where.category_id = categoryIds;
  if (is_featured !== undefined) where.is_featured = is_featured === "true";
  if (is_new !== undefined) where.is_new = is_new === "true";

  const { count, rows } = await Product.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    attributes: [
      "product_id",
      "name",
      "price",
      "image0",
      "is_featured",
      "is_new",
    ], // Chỉ lấy image0
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
    productData[`image${index}`] = img.url; // Đổi thành image0 đến image5
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
