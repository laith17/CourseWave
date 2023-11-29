const db = require("../db/db");

const createPaymentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS payments (
      payment_id SERIAL PRIMARY KEY,
      total_amount DOUBLE PRECISION NOT NULL,
      user_id INTEGER REFERENCES users(user_id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_deleted BOOLEAN NOT NULL DEFAULT false
    );
  `;

  try {
    await db.query(query);
    console.log("Payments table created successfully");
  } catch (error) {
    console.error("Error creating payments table:", error);
    throw error;
  }
};

const addPayment = async (user_id, total_amount) => {
  const query = {
    text: `
      INSERT INTO payments (user_id, total_amount)
      VALUES ($1, $2)
      RETURNING *;
    `,
    values: [user_id, total_amount],
  };

  const result = await db.query(query);
  return result.rows[0];
};

module.exports = {
  createPaymentsTable,
  addPayment,
};
