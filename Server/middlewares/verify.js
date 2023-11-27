const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(cookieParser());

async function authorize(req, res, next) {
  try {
    if (!req.user) {
      const tokenCookie = req.headers.cookie;
      if (tokenCookie) {
        const cookiesArray = tokenCookie.split(";");
        const accessTokenCookie = cookiesArray.find((cookie) =>
          cookie.trim().startsWith("accessToken=")
        );
        if (accessTokenCookie) {
          const accessToken = accessTokenCookie.split("=")[1].trim();
          const user = jwt.verify(accessToken, process.env.SECRET_KEY);
          console.log(user);
          if (user.role_id) {
            req.user = user;
            next();
          } else {
            res.status(401).json("Unauthorized user");
          }
          console.log(user);
        }
      } else {
        res.status(401).json("You need to login first");
      }
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

function hasRole(roleId) {
  return async (req, res, next) => {
    try {
      const userRoleId = req.user.role_id;

      if (userRoleId === roleId) {
        next();
      } else {
        res.status(403).json("Forbidden: Insufficient permissions");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };
}

module.exports = {
  authorize,
  hasRole,
};
