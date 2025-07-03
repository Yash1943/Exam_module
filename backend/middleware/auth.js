var csurf = require("tiny-csrf");
const express = require("express");
const app = express();
const User = require("../models/User");
app.use(csurf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend/build")));

const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
// const connectEnsureLogin = require("connect-ensure-login");

const bodyParser = require("body-parser"); //for Read the post req of the body
const PositionPreference = require("../models/PositionPreference");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); //for understanding the url data

app.use(
  session({
    secret: "my-super-secret-key-2021095900023267",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     (username, password, done) => {
//       User.findOne({ where: { email: username } })
//         .then(async (user) => {
//           if (!user) {
//             return done(null, false, { message: "username does not exist." });
//           }
//           const result = await bcrypt.compare(password, user.password);
//           if (result) {
//             return done(null, user, { massage: "User Logged in" });
//           } else {
//             return done(null, false, { massage: "Incorrect password." });
//           }
//         })
//         .catch((error) => {
//           return done(error);
//         });
//     }
//   )
// );

passport.serializeUser((user, done) => {
  console.log("serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// app.get("/", (req, res) => {
//   try {
//     res.render("index", { title: "LMS Portal", csrfToken: req.csrfToken() });
//   } catch (error) {
//     console.log(error);
//     req.flash("error", `Error:${error}`);
//   }
// });

app.post("/api/login", async (req, res) => {
  const { aadhar_card, password } = req.body;
  if (!aadhar_card || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Aadhar card and password are required" });
  }
  try {
    const user = await User.findOne({ where: { aadharCardNo: aadhar_card } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Aadhar card or password" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid Aadhar card or password" });
    }
    // res.redirect("../frontend/src/components/home/home"); // Redirect to home page after successful login
    // Optionally, set session or return user info/token here
    // return res.json({
    //   success: true,
    //   message: "Login successful",
    //   user: { id: user.id, aadharCardNo: user.aadharCardNo },
    // });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

app.get("/api/signup", async (req, res) => {
  try {
    const get_applied_possition = await PositionPreference.findAll();
    console.log("get_applied_possition", get_applied_possition);
    return res.json({
      success: true,
      message: "Position preferences fetched successfully",
      data: get_applied_possition,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", `Error:${error}`);
  }
});

// CSRF protection middleware
// You must initialize this in your main app.js/server.js as per tiny-csrf docs
const authenticateCsrfToken = (req, res, next) => {
  // CSRF token is expected in the 'x-csrf-token' header
  const csrfToken = req.headers["x-csrf-token"];
  if (!csrfToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF token required",
    });
  }
  // tiny-csrf attaches req.csrfTokenIsValid
  if (!req.csrfTokenIsValid) {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token",
    });
  }
  next();
};

// Check user role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

// Check subscription status and limits
const checkSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if subscription is active
    if (user.subscription.status !== "active" && user.subscription.plan !== "free") {
      return res.status(403).json({
        success: false,
        message: "Active subscription required",
      });
    }

    // Check if subscription has expired
    if (user.subscription.endDate && user.subscription.endDate < new Date()) {
      user.subscription.status = "expired";
      await user.save();

      return res.status(403).json({
        success: false,
        message: "Subscription has expired",
      });
    }

    req.userSubscription = user.subscription;
    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify subscription",
      error: error.message,
    });
  }
};

// Rate limiting for exam attempts
const examAttemptLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.canAttemptExam()) {
      return res.status(429).json({
        success: false,
        message: "Exam attempt limit reached for your subscription plan",
        data: {
          currentAttempts: user.subscription.limits.examAttempts,
          maxAttempts: user.subscription.limits.maxExamAttempts,
        },
      });
    }

    next();
  } catch (error) {
    console.error("Exam attempt limit check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check exam attempt limits",
      error: error.message,
    });
  }
};

module.exports = {
  authenticateToken: authenticateCsrfToken, // renamed for compatibility
  requireRole,
  checkSubscription,
  examAttemptLimit,
};
