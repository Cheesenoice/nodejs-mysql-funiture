const express = require("express");
const router = express.Router();
const {
  createVoucher,
  addProductToVoucher,
} = require("../../controllers/admin/adminVoucherController");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.post("/", authMiddleware, adminMiddleware, createVoucher);
router.post(
  "/:voucher_id/products",
  authMiddleware,
  adminMiddleware,
  addProductToVoucher
);

module.exports = router;
