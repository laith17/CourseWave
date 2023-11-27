const db = require("../models/index");
const {
  addComment,
  updateComment,
  deleteComment,
  getComments,
} = require("../models/comments");

exports.addComment = async (req, res) => {
  try {
    const { comment_content, comment_rate } = req.body;
    const { course_id } = req.params;
    const { user_id } = req.user.user_id;

    const newCommentId = await addComment({
      comment_content,
      comment_rate,
      course_id,
      user_id,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment_id: newCommentId,
    });
  } catch (error) {
    console.error("Failed to add the comment: ", error);
    return res.status(500).json({ error: "Failed to add the comment" });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;
    const { comment_content, comment_rate } = req.body;

    const updatedCommentId = await updateComment({
      comment_id,
      comment_content,
      comment_rate,
    });

    res.status(200).json({
      message: "Comment updated successfully",
      comment_id: updatedCommentId,
    });
  } catch (error) {
    console.error("Failed to update the comment: ", error);
    return res.status(500).json({ error: "Failed to update the comment" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;

    const deletedCommentId = await deleteComment(comment_id);

    res.status(200).json({
      message: "Comment soft-deleted successfully",
      comment_id: deletedCommentId,
    });
  } catch (error) {
    console.error("Failed to delete the comment: ", error);
    return res.status(500).json({ error: "Failed to delete the comment" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const course_id = req.params.course_id;

    const comments = await getComments(course_id);

    res.status(200).json({
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (error) {
    console.error("Failed to retrieve comments: ", error);
    return res.status(500).json({ error: "Failed to retrieve comments" });
  }
};
