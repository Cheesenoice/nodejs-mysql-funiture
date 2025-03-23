const productService = require("../services/productService");

const getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts };
