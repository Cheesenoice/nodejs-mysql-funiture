const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/productController");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");
const { upload } = require("../../utils/upload");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 6),
  productController.createProduct
);
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 6),
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

module.exports = router;
