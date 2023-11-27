const db = require("../db/db");

const createCartTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS cart (
      order_id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(user_id),
      course_id INTEGER REFERENCES courses(course_id),
      amount DOUBLE PRECISION NOT NULL DEFAULT 0,
      is_deleted BOOLEAN NOT NULL DEFAULT false
    );
  `;

  try {
    await db.query(query);
    console.log("Cart table created successfully");
  } catch (error) {
    console.error("Error creating cart table:", error);
    throw error;
  }
};

const addToCart = async (user_id, course_id) => {
  const getTotalAmountQuery = {
    text: `
      SELECT SUM(course_price) AS total_amount
      FROM courses
      WHERE course_id = ANY($1::int[]);
    `,
    values: [[course_id]],
  };

  const totalAmountResult = await db.query(getTotalAmountQuery);
  const total_amount = totalAmountResult.rows[0].total_amount || 0;

  const insertCartItemQuery = {
    text: `
      INSERT INTO cart (user_id, course_id, total_amount)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    values: [user_id, course_id, total_amount],
  };

  const result = await db.query(insertCartItemQuery);
  return result.rows[0];
};

const deleteCartItem = async (order_id) => {
  const query = {
    text: `
      UPDATE cart
      SET is_deleted = true
      WHERE order_id = $1
      RETURNING *;
    `,
    values: [order_id],
  };

  const result = await db.query(query);
  return result.rows[0];
};

const getCartItems = async (user_id) => {
  const query = {
    text: `
      SELECT
        cart.*,
        courses.course_title,
        courses.course_length,
        courses.course_rate,
        courses.course_image
      FROM cart
      JOIN courses ON cart.course_id = courses.course_id
      WHERE cart.user_id = $1 AND cart.is_deleted = false;
    `,
    values: [user_id],
  };

  const result = await db.query(query);
  return result.rows;
};

const getTotalAmount = async (user_id) => {
  const getTotalAmountQuery = {
    text: `
      SELECT COALESCE(SUM(courses.course_price), 0) AS total_amount
      FROM cart
      JOIN courses ON cart.course_id = courses.course_id
      WHERE cart.user_id = $1 AND cart.is_deleted = false;
    `,
    values: [user_id],
  };

  const totalAmountResult = await db.query(getTotalAmountQuery);
  return totalAmountResult.rows[0].total_amount;
};

module.exports = {
  createCartTable,
  addToCart,
  deleteCartItem,
  getCartItems,
  getTotalAmount,
};
