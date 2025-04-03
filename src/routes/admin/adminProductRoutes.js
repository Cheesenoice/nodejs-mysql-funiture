const express = require("express");
const router = express.Router();
const adminProductController = require("../../controllers/admin/adminProductController");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");
const { upload } = require("../../utils/upload");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 6),
  adminProductController.createProduct
);
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 6),
  adminProductController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  adminProductController.deleteProduct
);

module.exports = router;
