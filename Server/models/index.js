const db = require("../db/db");
const usersModel = require("./users");
const rolesModel = require("./roles");
const trainersModel = require("./trainers");
const coursesModel = require("./courses");
const course_requirementsModel = require("./course_requirements");
const course_objectsModel = require("./course_objects");
const course_sectionsModel = require("./course_sections");
const section_videosModel = require("./section_videos");
const commentsModel = require("./comments");
const cartModel = require("./cart");
const purchasesModel = require("./purchases");
const liveSessionsModel = require("./liveSessions");

const initializationFunctions = [
  rolesModel.createRolesTable,
  usersModel.createUsersTable,
  trainersModel.createTrainersTable,
  coursesModel.createCoursesTable,
  course_requirementsModel.createCourseRequirementsTable,
  course_objectsModel.createCourseObjectsTable,
  course_sectionsModel.createCourseSectionsTable,
  section_videosModel.createSectionVideosTable,
  commentsModel.createCommentsTable,
  cartModel.createCartTable,
  purchasesModel.createPurchasesTable,
  liveSessionsModel.createLiveSessionsTable,
];

const initializeModels = async () => {
  // Execute each initialization function
  for (const initFunction of initializationFunctions) {
    await initFunction();
  }

  console.log("Tables initialized successfully");
};

module.exports = {
  db,
  users: usersModel,
  roles: rolesModel,
  trainers: trainersModel,
  courses: coursesModel,
  course_requirements: course_requirementsModel,
  course_objects: course_objectsModel,
  course_sections: course_sectionsModel,
  section_videos: section_videosModel,
  comments: commentsModel,
  cart: cartModel,
  purchases: purchasesModel,
  liveSession: liveSessionsModel,
  initializeModels,
};
