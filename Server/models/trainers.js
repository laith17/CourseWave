const db = require("../db/db");
const bcrypt = require("bcrypt");

const createTrainersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS trainers (
      trainer_id SERIAL PRIMARY KEY,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      field VARCHAR(255) NOT NULL,
      degree VARCHAR(255) NOT NULL,
      role_id INT DEFAULT 3 REFERENCES roles(role_id),
      is_deleted BOOLEAN NOT NULL DEFAULT false
    );
  `;

  try {
    await db.query(query);
    console.log("Trainers table created successfully");
  } catch (error) {
    console.error("Error creating trainers table:", error);
    throw error;
  }
};

module.exports = {
  createTrainersTable,
};

async function createTrainer({
  firstname,
  lastname,
  email,
  password,
  field,
  degree,
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = {
    text: `
      INSERT INTO trainers (firstname, lastname, email, password, field, degree)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING trainer_id;
    `,
    values: [firstname, lastname, email, hashedPassword, field, degree],
  };

  const result = await db.query(query);
  return result.rows[0].trainer_id;
}

async function findTrainerByEmail(email) {
  const query = {
    text: `
      SELECT * FROM trainers
      WHERE email = $1 AND is_deleted = false;
    `,
    values: [email],
  };

  const result = await db.query(query);
  return result.rows[0];
}

async function updateTrainer({
  firstname,
  lastname,
  email,
  password,
  field,
  degree,
  trainer_id,
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = {
    text: `
      UPDATE trainers
      SET firstname = $1, lastname = $2, email = $3, password = $4, field = $5, degree = $6
      WHERE trainer_id = $7 AND is_deleted = false
      RETURNING *;
    `,
    values: [
      firstname,
      lastname,
      email,
      hashedPassword,
      field,
      degree,
      trainer_id,
    ],
  };

  const result = await db.query(query);
  return result.rows[0];
}

async function softDeleteTrainer(trainer_id) {
  const query = {
    text: `
      UPDATE trainers
      SET is_deleted = true
      WHERE trainer_id = $1 AND is_deleted = false
      RETURNING trainer_id;
    `,
    values: [trainer_id],
  };

  const result = await db.query(query);
  return result.rows.length > 0;
}

const getTrainers = async (page, pageSize) => {
  const offset = (page - 1) * pageSize;

  const query = {
    text: `
      SELECT * FROM trainers
      ORDER BY trainer_id
      LIMIT $1 OFFSET $2;
    `,
    values: [pageSize, offset],
  };

  const result = await db.query(query);
  return result.rows;
};

module.exports = {
  createTrainersTable,
  createTrainer,
  findTrainerByEmail,
  updateTrainer,
  softDeleteTrainer,
  getTrainers,
};

// const { DataTypes } = require("sequelize");
// const sequelize = require("../db/db");

// const trainers = sequelize.define(
//   "trainers",
//   {
//     trainer_id: {
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
//       //   validate: {
//       //     isEmail: true, // Ensure the email field follows the email format
//       //   },
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     field: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     degree: {
//       type: DataTypes.STRING,
//       allowNull: false,
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

// module.exports = trainers;
