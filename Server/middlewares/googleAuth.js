const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const Users = require('../models/users');
require('dotenv').config();

const app = express();
app.use(express.json());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/google/callback',
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
        try {
           // Check if the user is already authenticated
    if (req.isAuthenticated()) {
         done(null, req.user);
      }
  
      // Check if the user exists in the database based on their Google ID or email
      const existingUser = await Users.findOne({
        $or: [
          { googleID: profile.id },
          { email: profile.email },
        ],
      });
  
      if (existingUser) {
        // User exists, log in
         done(null, existingUser.toJSON());
      } else {
        // User does not exist, create a new user
        const newUser = new Users({
          username: profile.displayName,
          email: profile.email,
          phoneNumber: profile.phone || null,
          profile_img: profile.picture,
          user_location: profile._json && profile._json.location || null,
          googleID: profile.id,
        });
  
        const savedUser = await newUser.save();
         done(null, savedUser.toJSON());
      }
          } catch (error) {
            done(error);
          }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    done(null, user);
});