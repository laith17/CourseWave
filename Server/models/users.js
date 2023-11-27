const db = require("../db/db"); // Adjust the path based on your project structure
const bcrypt = require("bcrypt");

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role_id INT DEFAULT 2 REFERENCES roles(role_id),
      is_deleted BOOLEAN NOT NULL DEFAULT false
    );
  `;
  // role_id INTEGER NOT NULL REFERENCES roles(role_id),
  try {
    await db.query(query);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
};

async function createUser({ firstname, lastname, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const defaultRoleId = 2;

  const query = {
    text: `
      INSERT INTO users (firstname, lastname, email, password, role_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id;
    `,
    values: [firstname, lastname, email, hashedPassword, defaultRoleId],
  };

  const result = await db.query(query);
  return result.rows[0].user_id;
}

async function findUserByEmail(email) {
  const query = {
    text: `
      SELECT * FROM users
      WHERE email = $1 AND is_deleted = false;
    `,
    values: [email],
  };

  const result = await db.query(query);
  return result.rows[0];
}

async function updateUser({ firstname, lastname, email, password, user_id }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const defaultRoleId = 2;

  const query = {
    text: `
      UPDATE users
      SET firstname = $1, lastname = $2, email = $3, password = $4, role_id = $5
      WHERE user_id = $6 AND is_deleted = false
      RETURNING user_id;
    `,
    values: [
      firstname,
      lastname,
      email,
      hashedPassword,
      defaultRoleId,
      user_id,
    ],
  };

  const result = await db.query(query);

  if (result.rows.length > 0) {
    return [1, result.rows[0]]; // User updated successfully
  } else {
    return [0, null]; // User not found or not updated
  }
}

async function softDeleteUser(user_id) {
  const query = {
    text: `
      UPDATE users
      SET is_deleted = true
      WHERE user_id = $1 AND is_deleted = false
      RETURNING user_id;
    `,
    values: [user_id],
  };

  const result = await db.query(query);
  return result.rows.length > 0;
}

const getUsers = async (page, pageSize) => {
  const offset = (page - 1) * pageSize;

  const query = {
    text: `
      SELECT * FROM users
      ORDER BY user_id
      LIMIT $1 OFFSET $2;
    `,
    values: [pageSize, offset],
  };

  const result = await db.query(query);
  return result.rows;
};

module.exports = {
  createUsersTable,
  createUser,
  findUserByEmail,
  updateUser,
  softDeleteUser,
  getUsers,
};

// const { DataTypes } = require("sequelize");
// const sequelize = require("../db/db");

// const users = sequelize.define(
//   "users",
//   {
//     user_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     firstname: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     lastname: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     role_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "roles",
//         key: "role_id",
//       },
//     },
//     is_deleted: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//     },
//   },
//   {
//     timestamps: false, // This disables the createdAt and updatedAt columns
//   }
// );

// module.exports = users;
