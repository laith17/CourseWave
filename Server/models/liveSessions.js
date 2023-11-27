const db = require("../db/db");

const createLiveSessionsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS liveSessions (
      session_id SERIAL PRIMARY KEY,
      session_title VARCHAR(255) NOT NULL,
      session_date DATE NOT NULL,
      session_time TIME NOT NULL,
      current_viewers INTEGER DEFAULT 0,
      trainer_id INTEGER NOT NULL REFERENCES trainers(trainer_id)
   );
  `;

  try {
    await db.query(query);
    console.log("liveSessions table created successfully");
  } catch (error) {
    console.error("Error creating liveSessions table:", error);
    throw error;
  }
};

const createLiveSession = async ({
  trainer_id,
  session_title,
  session_date,
  session_time,
}) => {
  const query = {
    text: `
      INSERT INTO liveSessions (trainer_id, session_title, session_date, session_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
    values: [trainer_id, session_title, session_date, session_time],
  };

  const result = await db.query(query);
  return result.rows[0];
};

const getLiveSessions = async () => {
  const query = "SELECT * FROM liveSessions;";
  const result = await db.query(query);
  return result.rows;
};

const getLiveSessionById = async (session_id) => {
  const query = {
    text: "SELECT * FROM liveSessions WHERE session_id = $1;",
    values: [session_id],
  };
  const result = await db.query(query);
  return result.rows[0];
};

const updateLiveSession = async (session_id, sessionUpdates) => {
  const { session_title, session_date, session_time } = sessionUpdates;
  const query = {
    text: `
      UPDATE liveSessions
      SET session_title = $1, session_date = $2, session_time = $3
      WHERE session_id = $4
      RETURNING *;
    `,
    values: [session_title, session_date, session_time, session_id],
  };

  const result = await db.query(query);
  return result.rows[0];
};

const enterLiveSession = async (session_id) => {
  const query = {
    text: `
      UPDATE liveSessions
      SET current_viewers = current_viewers + 1
      WHERE session_id = $1
      RETURNING current_viewers;
    `,
    values: [session_id],
  };

  const result = await db.query(query);
  return result.rows[0].current_viewers;
};

const exitLiveSession = async (session_id) => {
  const query = {
    text: `
      UPDATE liveSessions
      SET current_viewers = GREATEST(current_viewers - 1, 0)
      WHERE session_id = $1
      RETURNING current_viewers;
    `,
    values: [session_id],
  };

  const result = await db.query(query);
  return result.rows[0].current_viewers;
};

const deleteLiveSession = async (session_id) => {
  const query = {
    text: "DELETE FROM liveSessions WHERE session_id = $1 RETURNING *;",
    values: [session_id],
  };
  const result = await db.query(query);
  return result.rows[0];
};

module.exports = {
  createLiveSessionsTable,
  createLiveSession,
  getLiveSessions,
  updateLiveSession,
  enterLiveSession,
  exitLiveSession,
  getLiveSessionById,
  deleteLiveSession,
};
