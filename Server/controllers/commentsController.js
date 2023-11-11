const db = require("../models/index");

exports.addComment = async (req, res) => {
  try {
    const { comment_content, comment_rate } = req.body;
    const { course_id, user_id } = req.params;

    // Fetch user details by joining with the 'users' table
    const user = await db.users.findByPk(user_id, {
      attributes: ["firstname", "lastname"], // Specify the columns you need
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Concatenate firstname and lastname to create comment_author
    const comment_author = `${user.firstname} ${user.lastname}`;

    const newComment = await db.comments.create({
      comment_content,
      comment_author,
      comment_rate,
      course_id,
      user_id,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment_id: newComment.comment_id,
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

    const comment = await db.comments.findByPk(comment_id, {
      where: { is_deleted: false }, // Ensure the comment is not soft-deleted
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const updatedComment = await comment.update({
      comment_content,
      comment_rate,
    });

    res.status(200).json({
      message: "Comment updated successfully",
      comment_id: updatedComment.comment_id,
    });
  } catch (error) {
    console.error("Failed to update the comment: ", error);
    return res.status(500).json({ error: "Failed to update the comment" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;

    const comment = await db.comments.findByPk(comment_id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Perform the soft delete by updating is_deleted to true
    await comment.update({ is_deleted: true });

    res.status(200).json({
      message: "Comment soft-deleted successfully",
      comment_id: comment.comment_id,
    });
  } catch (error) {
    console.error("Failed to delete the comment: ", error);
    return res.status(500).json({ error: "Failed to delete the comment" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const course_id = req.params.course_id;

    const comments = await db.comments.findAll({
      where: {
        course_id,
        is_deleted: false, // Ensure only non-soft-deleted comments are retrieved
      },
    });

    res.status(200).json({
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (error) {
    console.error("Failed to retrieve comments: ", error);
    return res.status(500).json({ error: "Failed to retrieve comments" });
  }
};
