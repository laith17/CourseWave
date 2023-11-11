const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const course_requirements = sequelize.define(
  "course_requirements",
  {
    requirements_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    requirement_1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirement_2: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirement_3: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirement_4: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirement_5: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirement_6: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirement_7: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirement_8: {
      type: DataTypes.TEXT,
      allowNull: true,
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

course_requirements.associate = (models) => {
  course_requirements.belongsTo(models.courses);
};

module.exports = course_requirements;
