const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const verifyMiddleware = require("../middlewares/verify");

router.post("/userSignup", userController.userSignup);
router.post("/trainerSignup", userController.trainerSignup);
router.post("/loginUser", verifyMiddleware.verifyJWT, userController.loginUser);
router.post(
  "/loginTrainer",
  verifyMiddleware.verifyJWT,
  userController.loginTrainer
);
router.put("/updateUser/:user_id", userController.updateUser);
router.put("/updateTrainer/:trainer_id", userController.updateTrainer);
router.put("/deleteUser/:user_id", userController.deleteUser);
router.put("/deleteTrainer/:trainer_id", userController.deleteTrainer);

module.exports = router;
