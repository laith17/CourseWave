// const db = require("../db/db");

// const createCatagoryTable = async () => {
//   const query = `CREATE TABLE IF NOT EXISTS course_catagories  (
//       catagory_id SERIAL PRIMARY KEY,
//       catagory_name VARCHAR(255) NOT NULL UNIQUE,
//       is_deleted BOOLEAN NOT NULL DEFAULT false
//     );`;
//   try {
//     await db.query(query);
//     console.log("Roles table created successfully");

//     const checkCatagoriesQuery = "SELECT * FROM course_catagories ;";
//     const existingCatagories = await db.query(checkCatagoriesQuery);

//     if (existingCatagories.rows.length === 0) {
//       const initialCatagories = [
//         { catagory_name: "Development" },
//         { catagory_name: "Design" },
//         { catagory_name: "IT and Software" },
//         { catagory_name: "Online Classes" },
//         { catagory_name: "Self Development" },
//         { catagory_name: "Marketing" },
//       ];
//       const insertQuery =
//         "INSERT INTO course_catagories (catagory_name) VALUES ($1), ($2), ($3), ($4), ($5), ($6) RETURNING *;";
//       const values = initialCatagories.map(
//         (catagory_name) => catagory_name.catagory_name
//       );

//       const result = await db.query(insertQuery, values);
//       console.log("Categories initialized successfully:", result.rows);
//     } else {
//       console.log("Categories already exist, skipping initialization");
//     }
//   } catch (error) {
//     console.error("Error creating course_catagories table:", error);
//     throw error;
//   }
// };

// module.exports = { createCatagoryTable };
