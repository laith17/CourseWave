const db = require("../models/db");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// const secretKey = crypto.randomBytes(32).toString("hex");
// console.log(secretKey);

const appController = {
  registerUser: async (req, res) => {
    const { firstName, lastName, email, password, role_id } = req.body;

    try {
      const checkQuery = "SELECT user_id FROM users WHERE email = $1";
      const checkResult = await db.query(checkQuery, [email]);

      if (checkResult.rows.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }

      const insertQuery = `INSERT INTO users ( firstName, lastName, email, password, role_id)
                              VALUES ($1, $2, $3, $4, $5)
                              RETURNING user_id`;

      const insertValues = [firstName, lastName, email, password, role_id];
      const result = await db.query(insertQuery, insertValues);
      const newUserId = result.rows[0].user_id;

      //   res
      //     .status(201)
      //     .json({ message: "User added successfully", user_id: newUserId });

      const payload = {
        firstName: insertValues[0],
        lastName: insertValues[1],
        email: insertValues[2],
        user_id: result.rows[0].user_id,
        role_id: insertValues[4],
      };
      console.log(payload);
      console.log(result);

      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      res.status(200).json({
        // message: "User added successfully",
        message: "User added successfully",
        user_id: newUserId,
        token: token,
      });
    } catch (error) {
      console.error("Failed to register: ", error);
      res.status(500).json({ error: "Failed to register" });
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const checkQuery =
        "SELECT * FROM users WHERE email = $1 AND password = $2";
      const checkResult = await db.query(checkQuery, [email, password]);

      if (!checkResult.rows.length === 1) {
        res.status(401).json({ error: "Invalid email or password" });
      }

      const payload = {
        firstName: checkResult.rows[0].firstname,
        lastName: checkResult.rows[0].lastname,
        email: checkResult.rows[0].email,
        user_id: checkResult.rows[0].user_id,
        role_id: checkResult.rows[0].role_id,
      };
      console.log(payload);
      console.log(checkResult);

      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      res.status(200).json({
        message: "Login successful",
        user: checkResult.rows[0],
        token: token,
      });
    } catch (error) {
      console.error("Login failed: ", error);
      res.status(500).json({ error: "Login failed" });
    }
  },
};

module.exports = appController;
