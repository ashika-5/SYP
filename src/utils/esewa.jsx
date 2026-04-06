import CryptoJS from "crypto-js";

const ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q";
const ESEWA_PRODUCT_CODE = "EPAYTEST";
const ESEWA_PAYMENT_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

export function initiateEsewaPayment({ amount, transactionId }) {
  const message = `total_amount=${amount},transaction_uuid=${transactionId},product_code=${ESEWA_PRODUCT_CODE}`;
  const hash = CryptoJS.HmacSHA256(message, ESEWA_SECRET_KEY);
  const signature = CryptoJS.enc.Base64.stringify(hash);

  const params = {
    amount: amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid: transactionId,
    product_code: ESEWA_PRODUCT_CODE,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: `${window.location.origin}/payment/success`,
    failure_url: `${window.location.origin}/payment/failure`,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signature,
  };

  const form = document.createElement("form");
  form.method = "POST";
  form.action = ESEWA_PAYMENT_URL;

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
