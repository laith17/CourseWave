const db = require("../db/db");

const createSectionVideosTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS section_videos (
      video_id SERIAL PRIMARY KEY,
      video_link TEXT NOT NULL,
      video_title TEXT NOT NULL,
      course_section_id INTEGER NOT NULL REFERENCES course_sections(course_section_id),
      is_deleted BOOLEAN NOT NULL DEFAULT false
    );
  `;

  try {
    await db.query(query);
    console.log("Section videos table created successfully");
  } catch (error) {
    console.error("Error creating section videos table:", error);
    throw error;
  }
};

// Add new section video
async function addSectionVideo(videoData) {
  const { video_title, video_link, course_section_id, is_deleted } = videoData;

  const result = await db.query({
    text: "INSERT INTO section_videos (video_title, video_link, course_section_id, is_deleted) VALUES ($1, $2, $3, $4) RETURNING *",
    values: [video_title, video_link, course_section_id, is_deleted],
  });

  return result.rows[0];
}

// Update section video details
async function updateSectionVideo({ video_id, video_title, video_link }) {
  await db.query({
    text: "UPDATE section_videos SET video_title = $2, video_link = $3 WHERE video_id = $1",
    values: [video_id, video_title, video_link],
  });
}

// Soft delete a section video
async function deleteSectionVideo(video_id) {
  await db.query({
    text: "UPDATE section_videos SET is_deleted = true WHERE video_id = $1",
    values: [video_id],
  });
}

async function getSectionVideoDetails(video_id) {
  const result = await db.query({
    text: "SELECT * FROM section_videos WHERE video_id = $1 AND is_deleted = false",
    values: [video_id],
  });

  return result.rows[0];
}

async function getSectionVideos(course_section_id) {
  const result = await db.query({
    text: "SELECT * FROM section_videos WHERE course_section_id = $1 AND is_deleted = false",
    values: [course_section_id],
  });

  return result.rows;
}

module.exports = {
  createSectionVideosTable,
  addSectionVideo,
  updateSectionVideo,
  deleteSectionVideo,
  getSectionVideoDetails,
  getSectionVideos,
};

// const { DataTypes } = require("sequelize");
// const sequelize = require("../db/db");

// const section_videos = sequelize.define(
//   "section_videos",
//   {
//     video_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     video_link: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     video_title: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     course_section_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "course_sections",
//         key: "course_section_id",
//       },
//     },
//     is_deleted: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//     },
//   },
//   {
//     timestamps: false, // This disables the createdAt and updatedAt columns
//   }
// );

// module.exports = section_videos;
