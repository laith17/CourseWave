const db = require("../db/db");

const createCommentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS comments (
      comment_id SERIAL PRIMARY KEY,
      comment_content TEXT NOT NULL,
      comment_author VARCHAR(255) NOT NULL,
      comment_rate INTEGER NOT NULL,
      course_id INTEGER NOT NULL REFERENCES courses(course_id),
      user_id INTEGER NOT NULL REFERENCES users(user_id),
      is_deleted BOOLEAN NOT NULL DEFAULT false
    );
  `;

  try {
    await db.query(query);
    console.log("Comments table created successfully");
  } catch (error) {
    console.error("Error creating comments table:", error);
    throw error;
  }
};

const addComment = async ({
  comment_content,
  comment_rate,
  course_id,
  user_id,
}) => {
  const userQuery = "SELECT firstname, lastname FROM users WHERE user_id = $1;";
  const userResult = await db.query(userQuery, [user_id]);
  const user = userResult.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const comment_author = `${user.firstname} ${user.lastname}`;

  const insertQuery = `
    INSERT INTO comments (comment_content, comment_author, comment_rate, course_id, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING comment_id;
  `;

  const result = await db.query(insertQuery, [
    comment_content,
    comment_author,
    comment_rate,
    course_id,
    user_id,
  ]);
  return result.rows[0].comment_id;
};

const updateComment = async ({ comment_id, comment_content, comment_rate }) => {
  const selectQuery =
    "SELECT * FROM comments WHERE comment_id = $1 AND is_deleted = false;";
  const comment = await db.query(selectQuery, [comment_id]);

  if (!comment.rows[0]) {
    throw new Error("Comment not found");
  }

  const updateQuery = `
    UPDATE comments
    SET comment_content = $1, comment_rate = $2
    WHERE comment_id = $3
    RETURNING comment_id;
  `;

  const updateResult = await db.query(updateQuery, [
    comment_content,
    comment_rate,
    comment_id,
  ]);
  return updateResult.rows[0].comment_id;
};

const deleteComment = async (comment_id) => {
  const selectQuery = "SELECT * FROM comments WHERE comment_id = $1;";
  const comment = await db.query(selectQuery, [comment_id]);

  if (!comment.rows[0]) {
    throw new Error("Comment not found");
  }

  const deleteQuery =
    "UPDATE comments SET is_deleted = true WHERE comment_id = $1;";
  await db.query(deleteQuery, [comment_id]);

  return comment_id;
};

const getComments = async (course_id) => {
  const query =
    "SELECT * FROM comments WHERE course_id = $1 AND is_deleted = false;";
  const comments = await db.query(query, [course_id]);
  return comments.rows;
};

module.exports = {
  createCommentsTable,
  addComment,
  updateComment,
  deleteComment,
  getComments,
};
