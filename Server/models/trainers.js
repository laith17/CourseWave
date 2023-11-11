const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const trainers = sequelize.define(
  "trainers",
  {
    trainer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      //   validate: {
      //     isEmail: true, // Ensure the email field follows the email format
      //   },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    field: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false, // This disables the createdAt and updatedAt columns
  }
);

module.exports = trainers;
