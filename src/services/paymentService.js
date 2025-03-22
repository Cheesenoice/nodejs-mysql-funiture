const https = require("https");
const crypto = require("crypto");
require("dotenv").config();

const momoPayment = (orderId, amount, redirectUrl, ipnUrl) => {
  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const partnerCode = "MOMO";
  const orderInfo = "Pay with MoMo";
  const requestType = "payWithMethod";
  const requestId = orderId;
  const extraData = "";
  const lang = "vi";
  const autoCapture = true;

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    signature,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const result = JSON.parse(data);
        if (result.resultCode === 0) resolve(result.payUrl);
        else reject(new Error(`MoMo error: ${result.message}`));
      });
    });

    req.on("error", (e) =>
      reject(new Error(`MoMo request failed: ${e.message}`))
    );
    req.write(requestBody);
    req.end();
  });
};

module.exports = { momoPayment };
