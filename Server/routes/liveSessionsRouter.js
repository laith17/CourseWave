// routes/liveSessions.js
const express = require("express");
const liveSessionsController = require("../controllers/liveSessionsController");
const verify = require("../middlewares/verify");
const router = express.Router();

router.post(
  "/createLiveSession",
  verify.authorize,
  liveSessionsController.createLiveSession
);

router.put(
  "/updateLiveSession/:session_id",
  liveSessionsController.updateLiveSession
);
router.put(
  "/enterLiveSession/:session_id",
  liveSessionsController.enterLiveSession
);
router.put(
  "/exitLiveSession/:session_id",
  liveSessionsController.exitLiveSession
);

router.delete(
  "/deleteLiveSession/:session_id",
  liveSessionsController.deleteLiveSession
);

router.get("/getLiveSessions", liveSessionsController.getLiveSessions);
router.get(
  "/getLiveSession/:session_id",
  liveSessionsController.getLiveSessionById
);

module.exports = router;
