const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const https = require("https");
const fs = require("fs");
require("dotenv").config();

// Create an Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'https://localhost:3000', // Update this to your frontend's HTTPS URL
  credentials: true // Allow credentials
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Use secure cookies
  })
);
app.use(passport.initialize());
app.use(passport.session());

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

const User = require('./models/user');

// Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://localhost:5001/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            picture: picture,
          }).save();
        } else {
          // update user information if it might have changed
          user.displayName = profile.displayName;
          user.email = profile.emails[0].value;
          user.picture = picture; 
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Auth Routes
app.get(
  "/auth/google",
  (req, res, next) => {
    console.log("Received request for /auth/google");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "https://localhost:3000/login" }),
  (req, res) => {
    console.log("Google authentication callback received");

    // Use the session to keep user logged in and just redirect to the homepage
    res.redirect("https://localhost:3000/");
  }
);


app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ error: "Error during logout" });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});


app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(204).end();
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    
    const HTTPS_PORT = process.env.HTTPS_PORT || 5001;
    
    // Check if SSL certificate files exist
    if (fs.existsSync('./keys/server.key') && fs.existsSync('./keys/server.cert')) {
      const privateKey = fs.readFileSync('./keys/server.key', 'utf8');
      const certificate = fs.readFileSync('./keys/server.cert', 'utf8');
      const credentials = { key: privateKey, cert: certificate };

      // Start HTTPS server
      https.createServer(credentials, app).listen(HTTPS_PORT, () => {
        console.log(`HTTPS Server running on https://localhost:${HTTPS_PORT}`);
      });
    } else {
      console.error("SSL certificate files not found. HTTPS server not started.");
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send('An unexpected error occurred');
});