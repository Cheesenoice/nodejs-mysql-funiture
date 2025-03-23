const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/admin/categoryController");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

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
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory
);

module.exports = router;
