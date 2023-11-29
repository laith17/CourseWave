const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paymentsModel = require("../models/payments");
const cartModel = require("../models/cart");

exports.createPaymentIntent = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Calculate total amount from cart items
    const total_amount = await cartModel.getTotalAmount(user_id);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total_amount * 100), // Convert to cents
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    // Save payment information in the database
    const payment = await paymentsModel.addPayment(user_id, total_amount);

    res.json({
      clientSecret: paymentIntent.client_secret,
      payment_id: payment.payment_id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { payment_id } = req.params;

    // Update the payment status in the database
    // You might want to check with Stripe API for payment success
    const updatedPayment = await paymentsModel.updatePaymentStatus(payment_id);

    // Soft delete cart items
    await cartModel.deleteCartItem(updatedPayment.user_id);

    res.json({ message: "Payment confirmed successfully" });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
};
