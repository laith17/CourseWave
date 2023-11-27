const purchasesModel = require("../models/purchases");

// Function to handle checkout and update purchases
exports.checkoutAndSavePurchases = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const result = await purchasesModel.checkoutAndSavePurchases(user_id);

    if (!result) {
      return res.status(404).json({ error: "No courses in the cart" });
    }

    res.status(200).json({
      message: "Checkout successful",
      purchases: result,
    });
  } catch (error) {
    console.error("Failed to process checkout: ", error);
    return res.status(500).json({ error: "Failed to process checkout" });
  }
};

// Function to get purchased courses for a user
exports.getPurchasedCoursesByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const courses = await purchasesModel.getPurchasedCoursesByUser(user_id);

    res.status(200).json({
      message: "Purchased courses retrieved successfully",
      courses,
    });
  } catch (error) {
    console.error("Failed to retrieve purchased courses: ", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve purchased courses" });
  }
};
