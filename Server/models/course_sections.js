const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const course_sections = sequelize.define(
  "course_sections",
  {
    course_section_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    section_name: {
      type: DataTypes.TEXT,
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

course_sections.associate = (models) => {
  course_sections.belongsTo(models.courses);
  course_sections.hasMany(models.section_videos, {
    foreignKey: "course_section_id",
  });
};

module.exports = course_sections;
