// const db = require("../db/db");

// const createCourseRequirementsTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS course_requirements (
//       requirement_id SERIAL PRIMARY KEY,
//       course_id INTEGER NOT NULL REFERENCES courses(course_id),
//       requirement TEXT NOT NULL,
//       is_deleted BOOLEAN NOT NULL DEFAULT false
//     );
//   `;

//   try {
//     await db.query(query);
//     console.log("Course requirements table created successfully");
//   } catch (error) {
//     console.error("Error creating course requirements table:", error);
//     throw error;
//   }
// };

// async function addCourseRequirement({ course_id, requirement }) {
//   const query = {
//     text: `
//       INSERT INTO course_requirements (course_id, requirement)
//       VALUES ($1, $2)
//       RETURNING requirement_id;
//     `,
//     values: [course_id, requirement],
//   };

//   const result = await db.query(query);
//   return result.rows[0].requirement_id;
// }

// async function updateCourseRequirement({ requirement_id, requirement }) {
//   const query = {
//     text: `
//       UPDATE course_requirements
//       SET requirement = $2
//       WHERE requirement_id = $1
//       RETURNING requirement_id;
//     `,
//     values: [requirement_id, requirement],
//   };

//   const result = await db.query(query);
//   return result.rows[0].requirement_id;
// }

// async function deleteCourseRequirement(requirement_id) {
//   const query = {
//     text: `
//       UPDATE course_requirements 
//       SET is_deleted = true 
//       WHERE requirement_id = $1
//       RETURNING requirement_id
//     `,
//     values: [requirement_id],
//   };

//   const result = await db.query(query);
//   return result.rows[0].requirement_id;
// }

// async function getCourseRequirementDetails(course_id) {
//   const query = {
//     text: `
//       SELECT * FROM course_requirements
//       WHERE course_id = $1 AND is_deleted = false;
//     `,
//     values: [course_id],
//   };

//   const result = await db.query(query);
//   return result.rows;
// }

// module.exports = {
//   createCourseRequirementsTable,
//   addCourseRequirement,
//   updateCourseRequirement,
//   deleteCourseRequirement,
//   getCourseRequirementDetails,
// };

// const { DataTypes } = require("sequelize");
// const sequelize = require("../db/db");

// const course_requirements = sequelize.define(
//   "course_requirements",
//   {
//     requirements_id: {
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
//     requirement_1: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     requirement_2: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     requirement_3: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     requirement_4: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     requirement_5: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     requirement_6: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     requirement_7: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     requirement_8: {
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
//     timestamps: false, // This disables the createdAt and updatedAt columns
//   }
// );

// module.exports = course_requirements;
