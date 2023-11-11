const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const section_videos = sequelize.define(
  "section_videos",
  {
    video_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    video_link: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    video_title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    course_section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "course_sections",
        key: "course_section_id",
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

module.exports = section_videos;
