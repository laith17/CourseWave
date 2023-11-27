// const {
//   courses,
//   course_objects,
//   course_requirements,
//   course_sections,
// } = require("../models");

// const associateModels = () => {
//   courses.hasMany(course_objects, { foreignKey: "course_id" });
//   courses.hasMany(course_requirements, { foreignKey: "course_id" });
//   courses.hasMany(course_sections, { foreignKey: "course_id" });

//   course_objects.belongsTo(courses, { foreignKey: "course_id" });
//   course_requirements.belongsTo(courses, { foreignKey: "course_id" });
//   course_sections.belongsTo(courses, { foreignKey: "course_id" });
//   course_sections.hasMany(section_videos, { foreignKey: "course_section_id" });
// };

// module.exports = associateModels;
