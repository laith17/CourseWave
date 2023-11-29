const express = require("express");
const courseCatagoriesController = require("../controllers/courseCatagoriesController");
const router = express.Router();
const verify = require("../middlewares/verify");

// router.get(
//   "/addCatagory",
//   verify.authorize,
//   role.hasRole(1),
//   courseCatagoriesController.addCatagory
// );

module.exports = router;
