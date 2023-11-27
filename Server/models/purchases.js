const db = require("../db/db");

const createPurchasesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS purchases (
      purchase_id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(user_id),
      purchased_courses INTEGER[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(query);
    console.log("Purchases table created successfully");
  } catch (error) {
    console.error("Error creating purchases table:", error);
    throw error;
  }
};

const checkoutAndSavePurchases = async (user_id) => {
  try {
    // Retrieve courses from the cart for the user
    const cartQuery = {
      text: `
        SELECT course_id FROM cart
        WHERE user_id = $1 AND is_deleted = false;
      `,
      values: [user_id],
    };

    const cartResult = await db.query(cartQuery);
    const purchased_courses = cartResult.rows.map((row) => row.course_id);

    if (purchased_courses.length === 0) {
      return null; // No courses in the cart
    }

    // Save the purchases in the 'purchases' table
    const savePurchasesQuery = {
      text: `
        INSERT INTO purchases (user_id, purchased_courses)
        VALUES ($1, $2)
        RETURNING *;
      `,
      values: [user_id, purchased_courses],
    };

    const result = await db.query(savePurchasesQuery);

    // Soft-delete the courses from the cart after successful checkout
    const softDeleteCartQuery = {
      text: `
        UPDATE cart SET is_deleted = true
        WHERE user_id = $1;
      `,
      values: [user_id],
    };

    await db.query(softDeleteCartQuery);

    return result.rows[0];
  } catch (error) {
    console.error("Error processing checkout: ", error);
    throw error;
  }
};

// Function to get purchased courses for a user
const getPurchasedCoursesByUser = async (user_id) => {
  try {
    const query = {
      text: `
        SELECT p.purchased_courses, c.*
        FROM purchases p
        JOIN courses c ON c.course_id = ANY(p.purchased_courses)
        WHERE p.user_id = $1;
      `,
      values: [user_id],
    };

    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving purchased courses: ", error);
    throw error;
  }
};

module.exports = {
  createPurchasesTable,
  checkoutAndSavePurchases,
  getPurchasedCoursesByUser,
};
