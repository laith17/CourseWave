const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const verify = require("../middlewares/verify");
const role = require("../middlewares/verify");

router.post("/userSignup", userController.userSignup);
router.post("/trainerSignup", userController.trainerSignup);

router.post("/loginUser", userController.loginUser);
router.post("/loginTrainer", userController.loginTrainer);

router.put("/updateUser", verify.authorize, userController.updateUserHandler);
router.put(
  "/updateTrainer",
  verify.authorize,
  userController.updateTrainerHandler
);

router.put(
  "/deleteUser",
  verify.authorize,
  role.hasRole(1),
  userController.deleteUser
);
router.put(
  "/deleteTrainer",
  verify.authorize,
  role.hasRole(1),
  userController.deleteTrainer
);

router.get(
  "/getUsers",
  verify.authorize,
  role.hasRole(1),
  userController.getAllUsers
);
router.get(
  "/getTrainers",
  verify.authorize,
  role.hasRole(1),
  userController.getAllTrainers
);

module.exports = router;
