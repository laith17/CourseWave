const db = require("../db/db");

const createCatagoryTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS course_catagories  (
      catagory_id SERIAL PRIMARY KEY,
      catagory_name VARCHAR(255) NOT NULL UNIQUE,
      is_deleted BOOLEAN NOT NULL DEFAULT false
    );`;

  try {
    await db.query(query);
    console.log("course_catagories table created successfully");
  } catch (error) {
    console.error("Error creating course_catagories table:", error);
    throw error;
  }
};

module.exports = { createCatagoryTable };
