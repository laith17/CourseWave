const express = require("express");
const cartController = require("../controllers/cartController");
const router = express.Router();
const verify = require("../middlewares/verify");

router.post(
  "/addToCart/:course_id",
  verify.authorize,
  cartController.addToCart
);

router.put("/deleteCartItem/:order_id", cartController.deleteCartItem);

router.get("/getCartItems", verify.authorize, cartController.getCartItems);
router.get("/getTotalAmount", verify.authorize, cartController.getTotalAmount);

module.exports = router;
