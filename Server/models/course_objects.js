const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const course_objects = sequelize.define(
  "course_objects",
  {
    objects_id: {
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
    object_1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    object_2: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    object_3: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    object_4: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    object_5: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    object_6: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    object_7: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    object_8: {
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
    timestamps: false, 
  },
);

// course_objects.associate = (models) => {
//   course_objects.belongsTo(models.courses);
// };

module.exports = course_objects;
