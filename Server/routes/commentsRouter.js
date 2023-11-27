const express = require("express");
const commentsController = require("../controllers/commentsController");
const router = express.Router();
const verify = require("../middlewares/verify");

router.post(
  "/addComment/:course_id/",
  verify.authorize,
  commentsController.addComment
);
router.put("/updateComment/:comment_id", commentsController.updateComment);
router.put("/deleteComment/:comment_id", commentsController.deleteComment);
router.get("/getComments/:course_id", commentsController.getComments);

module.exports = router;
