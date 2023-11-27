const cartModel = require("../models/cart");

exports.addToCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const course_id = req.params.course_id;

    const cartItem = await cartModel.addToCart(user_id, course_id);

    res.status(201).json({
      message: "Course added to cart successfully",
      cartItem,
    });
  } catch (error) {
    console.error("Failed to add course to cart:", error);
    res.status(500).json({ error: "Failed to add course to cart" });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const { order_id } = req.params;

    const deletedCartItem = await cartModel.deleteCartItem(order_id);

    res.status(200).json({
      message: "Cart item deleted successfully",
      cartItem: deletedCartItem,
    });
  } catch (error) {
    console.error("Failed to delete cart item: ", error);
    return res.status(500).json({ error: "Failed to delete cart item" });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const cartItems = await cartModel.getCartItems(user_id);

    res.status(200).json({
      message: "Cart items retrieved successfully",
      cartItems,
    });
  } catch (error) {
    console.error("Failed to retrieve cart items: ", error);
    return res.status(500).json({ error: "Failed to retrieve cart items" });
  }
};

exports.getTotalAmount = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Assuming you have the user_id in the request

    const totalAmount = await cartModel.getTotalAmount(user_id);

    res.status(200).json({
      message: "Total amount retrieved successfully",
      total_amount: totalAmount,
    });
  } catch (error) {
    console.error("Failed to retrieve total amount: ", error);
    return res.status(500).json({ error: "Failed to retrieve total amount" });
  }
};
