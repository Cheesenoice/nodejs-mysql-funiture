const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

router.get("/", categoryController.getAllCategories);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  categoryController.createCategory
);
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.updateCategory
); // Đổi từ put sang patch
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory
);

module.exports = router;
