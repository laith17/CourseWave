const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const courses = sequelize.define(
  "courses",
  {
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    course_title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    course_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    course_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    course_rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    course_length: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    course_image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    trainer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "trainers",
        key: "trainer_id",
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

courses.associate = (models) => {
  courses.hasMany(models.course_objects, { foreignKey: "course_id" });
  courses.hasMany(models.course_requirements, { foreignKey: "course_id" });
  courses.hasMany(models.course_sections, { foreignKey: "course_id" });
};

module.exports = courses;
