require("dotenv").config();
const jwt = require("jsonwebtoken");

// fetch("http............/login") {
//      header: {
//       authorization : document.cookies.get(token)
//      }
// }

const vertify = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};
module.exports = vertify;
