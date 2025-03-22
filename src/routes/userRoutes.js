const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.get("/me", authMiddleware, userController.getProfile);
router.patch("/me", authMiddleware, userController.updateProfile); // Đổi từ put sang patch

module.exports = router;
