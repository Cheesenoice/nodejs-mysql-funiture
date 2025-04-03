const https = require("https");
const crypto = require("crypto");

const momoPayment = (momoOrderId, amount, redirectUrl, ipnUrl) => {
  const partnerCode = "MOMO"; // Thay bằng mã của bạn
  const accessKey = "F8BBA842ECF85"; // Thay bằng key của bạn
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"; // Thay bằng secret của bạn
  const requestId = `${partnerCode}${Date.now()}`;
  const orderInfo = "Pay with MoMo";
  const requestType = "payWithMethod";
  const extraData = "";

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  console.log("Raw Signature:", rawSignature);

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  console.log("Signature:", signature);

  const requestBody = JSON.stringify({
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId: momoOrderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: "en",
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
        const response = JSON.parse(data);
        console.log("MoMo Response:", response);
        if (response.payUrl) resolve(response.payUrl);
        else reject(new Error("Failed to get payUrl"));
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
