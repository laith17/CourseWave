const express = require("express");
const paymentsController = require("../controllers/paymentsController");
const verify = require("../middlewares/verify");
const router = express.Router();

router.post(
  "/createPaymentIntent",
  verify.authorize,
  paymentsController.createPaymentIntent
);
router.post(
  "/confirmPayment/:payment_id",
  verify.authorize,
  paymentsController.confirmPayment
);

module.exports = router;
