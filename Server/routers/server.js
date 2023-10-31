const express = require("express");
const cors = require("cors");
const app = express();

const verify = require("../middlewares/verify");
const appController = require("../controllers/users");
const port = 5000;

app.use(cors());
app.use(express.json());

// Define Routes
app.post("/Register", appController.registerUser);
app.post("/Login", appController.loginUser);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
