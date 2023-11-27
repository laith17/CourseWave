const db = require("../db/db");

const createCourseObjectsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS course_objects (
      object_id SERIAL PRIMARY KEY,
      course_id INTEGER NOT NULL REFERENCES courses(course_id),
      object TEXT NOT NULL,
      is_deleted BOOLEAN NOT NULL DEFAULT false
    );
  `;

  try {
    await db.query(query);
    console.log("Course objects table created successfully");
  } catch (error) {
    console.error("Error creating course objects table:", error);
    throw error;
  }
};

async function addCourseObject({ course_id, object }) {
  const query = {
    text: `
      INSERT INTO course_objects (course_id, object)
      VALUES ($1, $2)
      RETURNING object_id;
    `,
    values: [course_id, object],
  };

  const result = await db.query(query);
  return result.rows[0].object_id;
}

async function updateCourseObject({ object_id, object }) {
  const query = {
    text: `
      UPDATE course_objects
      SET object = $2
      WHERE object_id = $1
      RETURNING object_id;
    `,
    values: [object_id, object],
  };

  const result = await db.query(query);
  return result.rows[0].object_id;
}

async function deleteCourseObject(object_id) {
  const query = {
    text: `
      UPDATE course_objects
      SET is_deleted = true
      WHERE object_id = $1
      RETURNING object_id;
    `,
    values: [object_id],
  };

  const result = await db.query(query);
  return result.rows[0].object_id;
}

async function getCourseObjectDetails(course_id) {
  const query = {
    text: `
      SELECT * FROM course_objects
      WHERE course_id = $1 AND is_deleted = false;
    `,
    values: [course_id],
  };

  const result = await db.query(query);
  return result.rows;
}

module.exports = {
  createCourseObjectsTable,
  addCourseObject,
  updateCourseObject,
  deleteCourseObject,
  getCourseObjectDetails,
};

// const { DataTypes } = require("sequelize");
// const sequelize = require("../db/db");

// const course_objects = sequelize.define(
//   "course_objects",
//   {
//     objects_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     course_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "courses",
//         key: "course_id",
//       },
//     },
//     object_1: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     object_2: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     object_3: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     object_4: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     object_5: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     object_6: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     object_7: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     object_8: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     is_deleted: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//     },
//   },
//   {
//     timestamps: false,
//   }
// );

// module.exports = course_objects;
