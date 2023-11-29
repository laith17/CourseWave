const db = require("../db/db");

const createCoursesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS courses (
      course_id SERIAL PRIMARY KEY,
      course_author VARCHAR(255) NOT NULL,
      course_title TEXT NOT NULL,
      course_tagline TEXT NOT NULL,
      course_description TEXT NOT NULL,
      course_price DOUBLE PRECISION NOT NULL,
      course_rate DOUBLE PRECISION DEFAULT 0,
      course_length DOUBLE PRECISION NOT NULL,
      catagory_id VARCHAR(255) NOT NULL,
      course_image TEXT NOT NULL,
      course_objectives TEXT[] NOT NULL,
      course_requirements TEXT[] NOT NULL,
      trainer_id INTEGER NOT NULL REFERENCES trainers(trainer_id),
      is_deleted BOOLEAN NOT NULL DEFAULT false
    );
  `;

  try {
    await db.query(query);
    console.log("Courses table created successfully");
  } catch (error) {
    console.error("Error creating courses table:", error);
    throw error;
  }
};

async function addCourse({
  course_title,
  course_description,
  course_price,
  course_rate,
  course_length,
  course_catagory,
  course_image,
  course_objectives,
  course_requirements,
  course_tagline,
  trainer_id,
}) {
  const trainerQuery =
    "SELECT firstname, lastname FROM trainers WHERE trainer_id = $1;";
  const trainerResult = await db.query(trainerQuery, [trainer_id]);
  const trainer = trainerResult.rows[0];

  if (!trainer) {
    throw new Error("User not found");
  }

  const course_author = `${trainer.firstname} ${trainer.lastname}`;

  const query = {
    text: `
      INSERT INTO courses
      (course_author, course_title, course_description, course_price, course_rate, course_length, course_catagory, course_image, course_objectives, course_requirements, course_tagline, trainer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING course_id;
    `,
    values: [
      course_author,
      course_title,
      course_description,
      course_price,
      course_rate,
      course_length,
      course_catagory,
      course_image,
      course_objectives,
      course_requirements,
      course_tagline,
      trainer_id,
    ],
  };

  const result = await db.query(query);
  return result.rows[0].course_id;
}

async function updateCourse({
  course_id,
  course_title,
  course_description,
  course_price,
  course_length,
  course_catagory,
  course_tagline,
  course_objectives,
  course_requirements,
}) {
  try {
    // Calculate average rating from comments for the course
    const averageRatingQuery = {
      text: `
        SELECT COALESCE(AVG(comment_rate), 0) AS average_rating
        FROM comments
        WHERE course_id = $1 AND is_deleted = false;
      `,
      values: [course_id],
    };

    const averageRatingResult = await db.query(averageRatingQuery);
    const averageRating = averageRatingResult.rows[0].average_rating;

    // Update course details including the calculated average rating
    const updateCourseQuery = {
      text: `
        UPDATE courses
        SET
          course_title = $2,
          course_description = $3,
          course_price = $4,
          course_length = $5,
          course_catagory = $6,
          course_tagline = $7,
          course_objectives = $8,
          course_requirements = $9,
          course_rate = $10
        WHERE course_id = $1
        RETURNING course_id;
      `,
      values: [
        course_id,
        course_title,
        course_description,
        course_price,
        course_length,
        course_catagory,
        course_tagline,
        course_objectives,
        course_requirements,
        averageRating,
      ],
    };

    const result = await db.query(updateCourseQuery);
    return result.rows[0].course_id;
  } catch (error) {
    console.error("Failed to update the course: ", error);
    throw error;
  }
}

async function deleteCourse(course_id) {
  const query = {
    text: `
      UPDATE courses
      SET is_deleted = true
      WHERE course_id = $1
      RETURNING course_id;
    `,
    values: [course_id],
  };

  const result = await db.query(query);
  return result.rows[0].course_id;
}

async function getCourses(page, pageSize) {
  const offset = (page - 1) * pageSize;

  const query = {
    text: `
      SELECT * FROM courses
      WHERE is_deleted = false
      ORDER BY course_id
      LIMIT $1 OFFSET $2;
    `,
    values: [pageSize, offset],
  };

  const result = await db.query(query);

  const coursesWithImage = result.rows.map((course) => ({
    ...course,
    image_url: course.course_image
      ? `http://localhost:5000/${course.course_image}`
      : null,
  }));

  return coursesWithImage;
}

async function getCourse(course_id) {
  const query = {
    text: `
      SELECT * FROM courses
      WHERE course_id = $1 AND is_deleted = false;
    `,
    values: [course_id],
  };

  const courseResult = await db.query(query);
  const course = courseResult.rows[0];

  if (!course) {
    return null; // Return null if course not found
  }

  const sectionsQuery = {
    text: `
      SELECT * FROM course_sections
      WHERE course_id = $1 AND is_deleted = false;
    `,
    values: [course_id],
  };

  const videosQuery = {
    text: `
      SELECT sv.*
      FROM section_videos sv
      JOIN course_sections cs ON sv.course_section_id = cs.course_section_id
      WHERE cs.course_id = $1 AND sv.is_deleted = false;
    `,
    values: [course_id],
  };

  const [sectionsResult, videosResult] = await Promise.all([
    db.query(sectionsQuery),
    db.query(videosQuery),
  ]);

  const sections = sectionsResult.rows;
  const videos = videosResult.rows;

  // Add image_url to course object
  const courseWithDetails = {
    ...course,
    sections,
    videos,
    image_url: course.course_image
      ? `http://localhost:5000/${course.course_image}`
      : null,
  };

  return courseWithDetails;
}

async function getCoursesByFilter(category, page, pageSize) {
  const offset = (page - 1) * pageSize;

  const query = {
    text: `
      SELECT * FROM courses
      WHERE course_catagory = $1 AND is_deleted = false
      ORDER BY course_id
      LIMIT $2 OFFSET $3;
    `,
    values: [category, pageSize, offset],
  };

  const result = await db.query(query);

  const coursesWithImage = result.rows.map((course) => ({
    ...course,
    image_url: course.course_image
      ? `http://localhost:5000/${course.course_image}`
      : null,
  }));

  return coursesWithImage;
}

async function getCoursesBySearch(searchTerm, page, pageSize) {
  const offset = (page - 1) * pageSize;

  const query = {
    text: `
      SELECT * FROM courses
      WHERE LOWER(course_title) LIKE LOWER($1) AND is_deleted = false
      ORDER BY course_id
      LIMIT $2 OFFSET $3;
    `,
    values: [`%${searchTerm}%`, pageSize, offset],
  };

  const result = await db.query(query);

  const coursesWithImage = result.rows.map((course) => ({
    ...course,
    image_url: course.course_image
      ? `http://localhost:5000/${course.course_image}`
      : null,
  }));

  return coursesWithImage;
}

async function getTrainerCourses(trainer_id, page, pageSize) {
  const offset = (page - 1) * pageSize;

  const query = {
    text: `
      SELECT * FROM courses
      WHERE trainer_id = $1 AND is_deleted = false
      ORDER BY course_id
      LIMIT $2 OFFSET $3;
    `,
    values: [trainer_id, pageSize, offset],
  };

  const result = await db.query(query);

  const coursesWithImage = result.rows.map((course) => ({
    ...course,
    image_url: course.course_image
      ? `http://localhost:5000/${course.course_image}`
      : null,
  }));

  return coursesWithImage;
}

module.exports = {
  createCoursesTable,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCourse,
  getCoursesByFilter,
  getCoursesBySearch,
  getTrainerCourses,
};
