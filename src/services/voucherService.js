const Voucher = require("../models/Voucher");
const ProductVoucher = require("../models/ProductVoucher");
const OrderVoucher = require("../models/OrderVoucher");

const createVoucher = async ({
  code,
  discount_type,
  discount_value,
  applicable_type,
  min_order_value,
  max_discount,
  start_date,
  end_date,
  max_usage,
}) => {
  // Kiểm tra trùng code
  const existingVoucher = await Voucher.findOne({ where: { code } });
  if (existingVoucher) throw new Error("Voucher code already exists");

  const voucher = await Voucher.create({
    code,
    discount_type,
    discount_value,
    applicable_type,
    min_order_value,
    max_discount,
    start_date,
    end_date,
    max_usage,
    used_count: 0,
  });
  return voucher;
};

const addProductToVoucher = async (voucher_id, product_id) => {
  const voucher = await Voucher.findByPk(voucher_id);
  if (!voucher || voucher.applicable_type !== "product")
    throw new Error("Invalid voucher");
  const productVoucher = await ProductVoucher.create({
    voucher_id,
    product_id,
  });
  return productVoucher;
};

const applyVoucher = async (voucher_code, cartItems, totalAmount) => {
  const voucher = await Voucher.findOne({ where: { code: voucher_code } });
  if (!voucher) throw new Error("Invalid voucher");
  const now = new Date();
  if (now < voucher.start_date || now > voucher.end_date)
    throw new Error("Voucher expired");
  if (voucher.max_usage && voucher.used_count >= voucher.max_usage)
    throw new Error("Voucher usage limit reached");
  if (totalAmount < voucher.min_order_value)
    throw new Error("Order value too low");

  let discountApplied = 0;
  if (voucher.applicable_type === "all") {
    discountApplied =
      voucher.discount_type === "percentage"
        ? Math.min(
            totalAmount * (voucher.discount_value / 100),
            voucher.max_discount || Infinity
          )
        : voucher.discount_value;
  } else if (voucher.applicable_type === "product") {
    const applicableProducts = await voucher.getProductVouchers();
    const applicableProductIds = applicableProducts.map((pv) => pv.product_id);
    for (const item of cartItems) {
      if (applicableProductIds.includes(item.product_id)) {
        discountApplied +=
          voucher.discount_type === "percentage"
            ? item.price * item.quantity * (voucher.discount_value / 100)
            : voucher.discount_value * item.quantity;
      }
    }
  }

  return { voucher, discountApplied };
};

const recordVoucherUsage = async (order_id, voucher_id, discount_applied) => {
  await OrderVoucher.create({ order_id, voucher_id, discount_applied });
  const voucher = await Voucher.findByPk(voucher_id);
  await voucher.update({ used_count: voucher.used_count + 1 });
};

module.exports = {
  createVoucher,
  addProductToVoucher,
  applyVoucher,
  recordVoucherUsage,
};
