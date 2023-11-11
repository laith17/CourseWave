const express = require("express");
const commentsController = require("../controllers/commentsController");
const router = express.Router();

router.post("/addComment/:course_id/:user_id", commentsController.addComment);
router.put("/updateComment/:comment_id", commentsController.updateComment);
router.put("/deleteComment/:comment_id", commentsController.deleteComment);
router.get("/getComments/:course_id",commentsController.getComments);

module.exports = router;
