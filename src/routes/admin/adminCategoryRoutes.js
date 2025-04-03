const express = require("express");
const router = express.Router();
const adminCategoryController = require("../../controllers/admin/adminCategoryController");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  adminCategoryController.createCategory
);
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  adminCategoryController.updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  adminCategoryController.deleteCategory
);

module.exports = router;
