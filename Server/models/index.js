// models/index.js
const sequelize = require("../db/db");
const usersModel = require("./users");
const rolesModel = require("./roles");
const trainersModel = require("./trainers");
const coursesModel = require("./courses");
const course_requirementsModel = require("./course_requirements");
const course_objectsModel = require("./course_objects");
const course_sectionsModel = require("./course_sections");
const section_videosModel = require("./section_videos");
const commentsModel = require("./comments");

module.exports = {
  sequelize,
  users: usersModel,
  roles: rolesModel,
  trainers: trainersModel,
  courses: coursesModel,
  course_requirements: course_requirementsModel,
  course_objects: course_objectsModel,
  course_sections: course_sectionsModel,
  section_videos: section_videosModel,
  comments: commentsModel,
};
