const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./models/index");

//* Users Router
const usersRoute = require("./routes/usersRouter");

//* Courses Router
const coursesRoute = require("./routes/coursesRouter");

//* Comments Router
const commentsRoute = require("./routes/commentsRouter");

app.use(cors());
app.use(express.json());

app.use(usersRoute);
app.use(coursesRoute);
app.use(commentsRoute);

db.sequelize
  .sync()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((error) => {
    console.error("Error synchronizing the database:", error);
  });
