const db = require("../db/db");

const createRolesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS roles (
      role_id SERIAL PRIMARY KEY,
      role VARCHAR(255) NOT NULL UNIQUE
    );
  `;

  try {
    await db.query(query);
    console.log("Roles table created successfully");

    // Check if roles already exist
    const checkRolesQuery = "SELECT * FROM roles;";
    const existingRoles = await db.query(checkRolesQuery);

    // If no roles exist, insert the initial roles
    if (existingRoles.rows.length === 0) {
      const initialRoles = [
        { role: "Admin" },
        { role: "User" },
        { role: "Trainer" }, // New role
      ];
      const insertQuery =
        "INSERT INTO roles (role) VALUES ($1), ($2), ($3) RETURNING *;";
      const values = initialRoles.map((role) => role.role);

      const result = await db.query(insertQuery, values);
      console.log("Roles initialized successfully:", result.rows);
    } else {
      console.log("Roles already exist, skipping initialization");
    }
  } catch (error) {
    console.error("Error creating roles table:", error);
    throw error;
  }
};

module.exports = {
  createRolesTable,
};

// const { DataTypes } = require("sequelize");
// const sequelize = require("../db/db");

// const roles = sequelize.define(
//   "roles",
//   {
//     role_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     roleName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     timestamps: false, // This disables the createdAt and updatedAt columns
//   }
// );

// const initialRoles = [{ roleName: "Admin" }, { roleName: "User" }];

// // Synchronize the model with the database
// roles.sync({ force: true }).then(async () => {
//   // Bulk insert initial roles into the database
//   await roles.bulkCreate(initialRoles);
//   console.log("Roles initialized successfully");
// });

// module.exports = roles;
