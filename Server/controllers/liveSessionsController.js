const liveSessionsModel = require("../models/liveSessions");

exports.createLiveSession = async (req, res) => {
  try {
    const trainer_id = req.user.trainer_id;
    const { session_title, session_date, session_time } = req.body;
    const newSession = await liveSessionsModel.createLiveSession({
      trainer_id,
      session_title,
      session_date,
      session_time,
    });

    res.status(201).json({
      message: "Live session created successfully",
      session: newSession,
    });
  } catch (error) {
    console.error("Failed to create live session: ", error);
    res.status(500).json({ error: "Failed to create live session" });
  }
};

exports.getLiveSessions = async (req, res) => {
  try {
    const liveSessions = await liveSessionsModel.getLiveSessions();
    res.status(200).json({
      message: "Live sessions retrieved successfully",
      liveSessions,
    });
  } catch (error) {
    console.error("Failed to retrieve live sessions: ", error);
    res.status(500).json({ error: "Failed to retrieve live sessions" });
  }
};

exports.getLiveSessionById = async (req, res) => {
  try {
    const { session_id } = req.params;
    const liveSession = await liveSessionsModel.getLiveSessionById(session_id);
    if (!liveSession) {
      return res.status(404).json({ error: "Live session not found" });
    }
    res.status(200).json({
      message: "Live session retrieved successfully",
      liveSession,
    });
  } catch (error) {
    console.error("Failed to retrieve live session: ", error);
    res.status(500).json({ error: "Failed to retrieve live session" });
  }
};

exports.updateLiveSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const sessionUpdates = req.body;
    const updatedSession = await liveSessionsModel.updateLiveSession(
      session_id,
      sessionUpdates
    );
    if (!updatedSession) {
      return res.status(404).json({ error: "Live session not found" });
    }
    res.status(200).json({
      message: "Live session updated successfully",
      liveSession: updatedSession,
    });
  } catch (error) {
    console.error("Failed to update live session: ", error);
    res.status(500).json({ error: "Failed to update live session" });
  }
};

exports.enterLiveSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const currentViewers = await liveSessionsModel.enterLiveSession(session_id);

    if (currentViewers >= 5) {
      // Limit reached, deny entry
      return res.status(403).json({
        error: "Live session is full",
      });
    }

    res.status(200).json({
      message: "Entered live session successfully",
      currentViewers,
    });
  } catch (error) {
    console.error("Failed to enter live session: ", error);
    res.status(500).json({ error: "Failed to enter live session" });
  }
};

exports.exitLiveSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const currentViewers = await liveSessionsModel.exitLiveSession(session_id);

    res.status(200).json({
      message: "Exited live session successfully",
      currentViewers,
    });
  } catch (error) {
    console.error("Failed to exit live session: ", error);
    res.status(500).json({ error: "Failed to exit live session" });
  }
};

exports.deleteLiveSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const deletedSession = await liveSessionsModel.deleteLiveSession(
      session_id
    );
    if (!deletedSession) {
      return res.status(404).json({ error: "Live session not found" });
    }
    res.status(200).json({
      message: "Live session deleted successfully",
      liveSession: deletedSession,
    });
  } catch (error) {
    console.error("Failed to delete live session: ", error);
    res.status(500).json({ error: "Failed to delete live session" });
  }
};
