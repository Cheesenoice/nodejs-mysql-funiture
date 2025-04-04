const voucherService = require("../../services/voucherService");

const createVoucher = async (req, res) => {
  try {
    const {
      code,
      discount_type,
      discount_value,
      applicable_type,
      min_order_value,
      max_discount,
      start_date,
      end_date,
      max_usage,
    } = req.body;
    const voucher = await voucherService.createVoucher({
      code,
      discount_type,
      discount_value,
      applicable_type,
      min_order_value,
      max_discount,
      start_date,
      end_date,
      max_usage,
    });
    res.status(201).json({ success: true, data: voucher });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const addProductToVoucher = async (req, res) => {
  try {
    const { voucher_id } = req.params;
    const { product_id } = req.body;
    const productVoucher = await voucherService.addProductToVoucher(
      voucher_id,
      product_id
    );
    res.status(201).json({ success: true, data: productVoucher });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createVoucher, addProductToVoucher };
