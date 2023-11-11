const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const comments = sequelize.define(
  "comments",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    comment_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    comment_author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "courses",
        key: "course_id",
      },
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
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

module.exports = comments;
