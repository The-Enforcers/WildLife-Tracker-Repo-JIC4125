// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const https = require("https");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/authMiddleware");  // Import the middleware
require("dotenv").config();

// Create an Express app
const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(cors({
  origin: 'https://localhost:3000',
  credentials: true
}));

app.use(express.json()); // Parse JSON bodies

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Post routes
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes); // Routes are protected within postRoutes.js

// Admin routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log('Route:', r.route.path)
  }
});

// User routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

// Mongoose Models
const User = require('./models/User');

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://localhost:5001/auth/google/callback",
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

    // Check if user exists by googleId
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      // Create a new user if one does not exist
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        picture: picture,
      });

      // Save the new user to the database
      await user.save();
      console.log("New user created:", user);  // Log successful creation
    } else {
      // Update existing user details if necessary
      user.displayName = profile.displayName;
      user.email = profile.emails[0].value;
      user.picture = picture;
      await user.save();
      console.log("Existing user updated:", user);  // Log successful update
    }

    // Log user._id after save to confirm it exists
    console.log("User ID after save:", user._id);

    // Generate JWT token (optional for other purposes, but not needed for serializeUser)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("JWT token generated:", token);  // Log token

    return done(null, user);  // Pass only the user object to done()
  } catch (err) {
    console.error("Error in Google OAuth callback:", err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  console.log("User passed to serializeUser:", user);  // Log to confirm user details
  if (user && user._id) {
    done(null, user._id);  // Use _id for serialization
  } else {
    done(new Error("User _id not found for serialization"));
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Authentication routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "https://localhost:3000/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`https://localhost:3000/login?token=${token}`);
  }
);

// Logout route
app.get("/auth/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: "Error during logout" });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// Get authenticated user data
app.get("/api/user", verifyToken, async (req, res) => {
  try {
    // Get user from database using the ID from the token
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data
    res.json({
      _id: user._id,
      googleId: user.googleId,
      displayName: user.displayName,
      email: user.email,
      picture: user.picture,
      bio: user.bio,
      occupation: user.occupation,
      bookmarkedPosts: user.bookmarkedPosts,
      createdAt: user.createdAt,
      role:user.role
    });
  } catch (error) {
    console.error("Error in /api/user route:", error);
    res.status(500).json({ message: "Server error" });
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
  res.status(500).json({ message: 'An unexpected error occurred' });
});
