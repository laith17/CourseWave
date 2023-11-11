const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/coursesController");

router.post("/addCourse/:trainer_id", coursesController.addCourse);
router.post("/addCourseSection/:course_id", coursesController.addCourseSection);
router.post(
  "/addCourseVideos/:course_section_id",
  coursesController.addCourseVideos
);

router.put("/updateCourse/:course_id", coursesController.updateCourse);
router.put(
  "/updateCourseSection/:course_section_id",
  coursesController.updateCourseSection
);
router.put(
  "/updateCourseVideos/:video_id",
  coursesController.updateCourseVideos
);

router.put("/deleteCourse/:course_id", coursesController.deleteCourse);
router.put(
  "/deleteCourseSection/:course_section_id",
  coursesController.deleteCourseSection
);
router.put(
  "/deleteCourseVideos/:video_id",
  coursesController.deleteCourseVideos
);

router.get("/getCourse/:course_id", coursesController.getCourse);

module.exports = router;
